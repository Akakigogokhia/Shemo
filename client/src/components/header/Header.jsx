import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import './header.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [settings, setSettings] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const logout = () => {
    localStorage.removeItem('user');
    window.location.assign('/login');
  };
  return (
    <div className='hContainer'>
      <div className='hLeft'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <span className='logo'>Shemo</span>
        </Link>
      </div>
      <div className='hCenter'>
        <div className='searchbar'>
          <SearchIcon className='searchIcon' />
          <input
            placeholder='Search for friend, post or video'
            className='searchInput'
          />
        </div>
      </div>
      <div className='hRight'>
        <div className='hLinks'>
          <span className='hLink'>Homepage</span>
          <span className='hLink'>Timeline</span>
        </div>
        <div className='hIcons'>
          <div className='hIconItem'>
            <PersonIcon />
            <span className='hIconBadge'>1</span>
          </div>
          <div className='hIconItem'>
            <Link to='/chat' className='link'>
              <QuestionAnswerIcon />
            </Link>
            <span className='hIconBadge'>2</span>
          </div>
          <div className='hIconItem'>
            <NotificationsIcon />
            <span className='hIconBadge'>1</span>
          </div>
        </div>
        <img
          onClick={() => setSettings(!settings)}
          src={
            user.profilePicture
              ? PF + user.profilePicture
              : PF + 'person/noAvatar.png'
          }
          alt=''
          className='hImg'
        />
        {settings && (
          <div className='hSettings'>
            <Link
              to={`/profile/${user.username}`}
              style={{
                textDecoration: 'none',
                color: 'white',
              }}
            >
              <div className='viewProfile'>
                View Profile <AccountCircleIcon />
              </div>
            </Link>

            <div onClick={logout}>
              <label>Log out</label>
              <LogoutIcon />{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
