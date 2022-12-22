import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import './conversation.css';

function Conversation({ conversation, currentUser, active }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser._id
    );
    const getUser = async () => {
      try {
        const res = await axios.get('/users?userId=' + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  return (
    <div className='conversation'>
      <div className='imageContainer'>
        <img
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + 'person/noAvatar.png'
          }
          className='conversationImg'
        />
        {active ? <div className='chatOnlineBadge'></div> : ''}
      </div>
      <span className='conversationName'>{user?.username}</span>
    </div>
  );
}

export default Conversation;
