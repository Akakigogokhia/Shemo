import './rightbar.css';
import Online from '../online/Online';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { io } from 'socket.io-client';

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  useEffect(() => {
    socket.current = io('https://socket-0gbu.onrender.com');
  }, []);

  useEffect(() => {
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', currentUser?._id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(users.filter((u) => u.userId !== currentUser?._id));
    });
  }, [currentUser]);

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
    const getFriends = async () => {
      try {
        if (user) {
          const friendList = await axios.get('/users/friends/' + user?._id);
          setFriends(friendList.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: 'UNFOLLOW', payload: user._id });
      } else {
        axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: 'FOLLOW', payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const HomeRightbar = () => {
    return (
      <>
        <a href='https://www.lamborghini.com/en-en' target='_blank'>
          <img
            className='rightbarAd'
            src='https://cdnb.artstation.com/p/assets/images/images/005/047/357/large/allan-portilho-e89c6d32864153-56968c9449fea.jpg?1488129679'
          />
        </a>
        <h4 className='rightbarTitle'>Online Friends</h4>
        <ul className='rightbarFriendList'>
          {onlineUsers?.map((u) => (
            <Link
              to='/chat'
              key={u.userId}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <Online userId={u.userId} />
            </Link>
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className='rightbarFollowButton' onClick={handleClick}>
            {followed ? 'Unfollow' : 'Follow'}
            {!followed ? <AddIcon /> : <RemoveIcon />}
          </button>
        )}
        <h4 className='rightbarTitle'>User information</h4>
        <div className='rightbarInfo'>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>City:</span>
            <span className='rightbarInfoValue'>{user.city}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>From:</span>
            <span className='rightbarInfoValue'>{user.from}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>Relationship:</span>
            <span className='rightbarInfoValue'>
              {user.relationship ? user.relationship : '-'}
            </span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User friends</h4>
        <div className='rightbarFollowings'>
          {friends.map((friend) => (
            <Link
              to={'/profile/' + friend.username}
              style={{ textDecoration: 'none' }}
              key={friend._id}
            >
              <div className='rightbarFollowing'>
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + 'person/noAvatar.png'
                  }
                  alt=''
                  className='rightbarFollowingImg'
                />
                <span className='rightbarFollowingName'>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className='rightbar'>
      <div className='rightbarWrapper'>
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
