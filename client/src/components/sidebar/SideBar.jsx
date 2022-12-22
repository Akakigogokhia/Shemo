import './sidebar.css';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import GroupIcon from '@mui/icons-material/Group';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import EventIcon from '@mui/icons-material/Event';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import useFetch from '../../hooks/useFetch';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import SuggestedFriends from '../suggestedFriends/SuggestedFriends';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { data: users } = useFetch('/users/all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setSuggestedFriends(
      users.filter(
        (u) => !user.followings.includes(u._id) && user._id !== u._id
      )
    );
  }, [users]);

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <ul className='sidebarList'>
          <li className='sidebarListItem'>
            <RssFeedIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Feed</span>
          </li>
          <li className='sidebarListItem'>
            <QuestionAnswerIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Chats</span>
          </li>
          <li className='sidebarListItem'>
            <PlayCircleFilledWhiteIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Videos</span>
          </li>
          <li className='sidebarListItem'>
            <GroupIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Groups</span>
          </li>
          <li className='sidebarListItem'>
            <BookmarkIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Bookmarks</span>
          </li>
          <li className='sidebarListItem'>
            <HelpOutlineOutlinedIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Questions</span>
          </li>
          <li className='sidebarListItem'>
            <WorkOutlineOutlinedIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Jobs</span>
          </li>
          <li className='sidebarListItem'>
            <EventIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Events</span>
          </li>
          <li className='sidebarListItem'>
            <SchoolOutlinedIcon className='sidebarIcon' />
            <span className='sidebarListItemText'>Courses</span>
          </li>
        </ul>
        <button className='sidebarButton'>Show More</button>
        <hr className='sidebarHr' />
        <ul className='sidebarFriendList'>
          {suggestedFriends?.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u.username}`}
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <SuggestedFriends user={u} />
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
