import axios from 'axios';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import './chatOnline.css';

function ChatOnline({ onlineUsers, currentId, setCurrentChat, user }) {
  const [friends, setFriends] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { data: users } = useFetch('/users/all');
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setSuggestedFriends(
      users.filter(
        (u) => !user.followings.includes(u._id) && user._id !== u._id
      )
    );
  }, [users]);

  const handleClick = async (friend) => {
    let res;
    try {
      res = await axios.get(`/conversations/find/${currentId}/${friend._id}`);
      if (!res.data) {
        try {
          res = await axios.post('/conversations', {
            senderId: currentId,
            receiverId: friend._id,
          });
        } catch (error) {}
      }
      setCurrentChat(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (currentId) {
          const res = await axios.get('/users/friends/' + currentId);
          setFriends(res.data);
        }
      } catch (error) {}
    };
    getFriends();
  }, [currentId]);

  return (
    <div className='chatOnline'>
      <p className='friendType'>Friends</p>
      {friends.map((friend) => (
        <div
          className='chatOnlineFriend'
          onClick={() => handleClick(friend)}
          key={friend._id}
        >
          <div className='chatOnlineImgContainer'>
            <img
              className='chatOnlineImg'
              src={
                friend?.profilePicture
                  ? PF + friend?.profilePicture
                  : PF + 'person/noAvatar.png'
              }
            />
            {onlineUsers.some((u) => u.userId === friend._id) && (
              <div className='chatOnlineBadge1'></div>
            )}
          </div>
          <div className='chatOnlineName'>{friend.username}</div>
        </div>
      ))}
      <p className='friendType'>Suggested Friends</p>
      {suggestedFriends.map((friend) => (
        <div
          className='chatOnlineFriend'
          onClick={() => handleClick(friend)}
          key={friend._id}
        >
          <div className='chatOnlineImgContainer'>
            <img
              className='chatOnlineImg'
              src={
                friend?.profilePicture
                  ? PF + friend?.profilePicture
                  : PF + 'person/noAvatar.png'
              }
            />

            {onlineUsers.some((u) => u.userId === friend._id) && (
              <div className='chatOnlineBadge1'></div>
            )}
          </div>
          <div className='chatOnlineName'>{friend.username}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatOnline;
