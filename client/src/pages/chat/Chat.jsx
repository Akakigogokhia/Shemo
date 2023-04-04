import React, { useContext, useState } from 'react';
import Header from '../../components/header/Header';
import Conversation from '../../components/conversations/Conversation';
import './chat.css';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { io } from 'socket.io-client';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from 'react-router-dom';

export default function Chat() {
  const [width, setWidth] = useState(window.innerWidth);
  const [single, setSingle] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friendImg, setFriendImg] = useState(null);
  const [friend, setFriend] = useState(null);
  const { user } = useContext(AuthContext);
  const socket = useRef();
  const scroll = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const configureChat = (conv) => {
    setCurrentChat(conv);
    setSingle(true);
  };

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const checkActive = (conv) => {
    const friendId = conv.members.find((member) => member !== user._id);
    return onlineUsers?.some((u) => u.userId === friendId);
  };

  useEffect(() => {
    socket.current = io('https://socket-0gbu.onrender.com', {
      reconnection: false,
    });
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    const friendId = currentChat?.members.find((member) => member !== user._id);
    const getUser = async () => {
      try {
        const res = await axios.get('/users?userId=' + friendId);
        setFriend(res.data);
        setFriendImg(res.data.profilePicture);
      } catch (error) {}
    };
    getUser();
  }, [currentChat]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user?._id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get('/conversations/' + user?._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('/messages/' + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    if (e.keyCode === 13 || !e.key) {
      if (newMessage.length > 0) {
        e.preventDefault();
        const message = {
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
          (member) => member !== user._id
        );

        socket.current.emit('sendMessage', {
          senderId: user._id,
          receiverId,
          text: newMessage,
        });

        try {
          const res = await axios.post('/messages', message);
          setMessages([...messages, res.data]);
          setNewMessage('');
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <>
      <Header />
      <div className='chat'>
        <div
          className='chatMenu'
          style={{ display: width < 768 && single ? 'none' : 'block' }}
        >
          <div className='chatMenuWrapper'>
            <input placeholder='Search for friends' className='chatMenuInput' />
            {conversations?.map((conv) => (
              <div key={conv._id} onClick={() => configureChat(conv)}>
                <Conversation
                  conversation={conv}
                  currentUser={user}
                  active={checkActive(conv)}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          className='chatBox'
          style={{ display: width < 768 && !single ? 'none' : 'block' }}
        >
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxHeader'>
                  {width < 768 && single && (
                    <KeyboardBackspaceIcon onClick={() => setSingle(false)} />
                  )}
                  <div className='cImgContainer'>
                    <Link to={`/profile/${friend?.username}`}>
                      <img
                        className='cHeaderImg'
                        src={
                          friendImg
                            ? PF + friendImg
                            : PF + 'person/noAvatar.png'
                        }
                      />
                    </Link>
                    <div className='iHeader'>
                      {checkActive(currentChat) ? (
                        <>
                          <div className='activeBadge'></div>
                          <div className='hUsername'>{friend?.username}</div>
                          <div className='active'>Active now</div>
                        </>
                      ) : (
                        <>
                          <div className='hUsername'>{friend?.username}</div>
                          <div className='active'>Away</div>
                        </>
                      )}
                    </div>
                    <div className='hIcon'>
                      <CallIcon />
                      <VideocamIcon />
                      <InfoIcon />
                    </div>
                  </div>
                </div>
                <div className='chatBoxTop'>
                  {messages?.map((message) => (
                    <div ref={scroll} key={message._id}>
                      <Message
                        friendImg={friendImg}
                        userImg={user.profilePicture}
                        message={message}
                        own={message.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='Write a message...'
                    onChange={handleChange}
                    value={newMessage}
                    onKeyDown={handleSubmit}
                  ></textarea>
                  <button className='chatSubmitButton' onClick={handleSubmit}>
                    Send
                  </button>
                </div>{' '}
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div
          className='chatOnline'
          style={{ display: width < 768 && single ? 'none' : 'block' }}
        >
          <div className='chatOnlineWrapper'>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={configureChat}
              user={user}
            />
          </div>
        </div>
      </div>
    </>
  );
}
