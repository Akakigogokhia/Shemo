import './online.css';
import useFetch from '../../hooks/useFetch';

export default function Online({ userId }) {
  const { data: user } = useFetch(`/users?userId=${userId}`);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className='rightbarFriend'>
      <div className='rightbarProfileImgContainer'>
        <img
          className='rightbarProfileImg'
          src={
            user.profilePicture
              ? PF + user?.profilePicture
              : PF + '/person/noAvatar.png'
          }
          alt=''
        />
        <span className='rightbarOnline'></span>
      </div>
      <span className='rightbarUsername'>{user?.username}</span>
    </li>
  );
}
