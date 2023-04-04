import './profile.css';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/SideBar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import axios from 'axios';
import { useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ProfileForm from '../../components/profileForm/ProfileForm';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  const [div, setDiv] = useState(false);
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users?username=${username}`);
        setUser(res.data);
      } catch (error) {}
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    setDiv(false);
  }, [username]);

  return (
    <>
      <Header />

      <div className='profile'>
        <Sidebar />
        <div className='profileRight'>
          <div className='profileRightTop'>
            <div className='profileCover'>
              <img
                className='profileCoverImg'
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + 'person/noCover.png'
                }
                alt=''
              ></img>
              <img
                className='profileUserImg'
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + 'person/noAvatar.png'
                }
                alt=''
              />

              {username === currentUser.username && (
                <MoreVertOutlinedIcon
                  className='updateUserInformation'
                  onClick={() => setDiv((prev) => !prev)}
                />
              )}
            </div>
            <div className='profileInfo'>
              <h4 className='profileInfoName'>{user.username}</h4>
              <span className='profileInfoDesc'>{user?.desc}</span>
            </div>
          </div>
          <div className='profileRightBottom'>
            <Feed username={user.username} />
            <Rightbar user={user} />
          </div>
        </div>
        <div
          className='profileSettings'
          style={{ display: div ? 'block' : 'none' }}
        >
          <ProfileForm user={user} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}
