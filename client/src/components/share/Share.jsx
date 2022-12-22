import './share.css';
import RoomIcon from '@mui/icons-material/Room';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';

export default function Share() {
  const user = JSON.parse(localStorage.getItem('user'));
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      newPost.img = fileName;
      try {
        await axios.post('/upload', data);
      } catch (err) {}
    }
    try {
      await axios.post('/posts', newPost);
      window.location.reload();
    } catch (err) {}
  };
  return (
    <div className='share'>
      <div className='shareWrapper'>
        <div className='shareTop'>
          <img
            className='shareProfileImg'
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + 'person/noAvatar.png'
            }
            alt=''
          />
          <input
            placeholder={`What's in your mind ${user.username.split(' ')[0]}?`}
            className='shareInput'
            ref={desc}
          />
        </div>
        <hr className='shareHr' />
        {file && (
          <div className='shareImgContainer'>
            <img src={URL.createObjectURL(file)} className='shareImg' />
            <CancelIcon
              className='shareCancelImg'
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className='shareBottom' onSubmit={submitHandler}>
          <div className='shareOptions'>
            <label htmlFor='file' className='shareOption'>
              <CameraAltIcon className='shareIcon' />
              <span className='shareOptionText'>Photo/Video</span>
              <input
                style={{ display: 'none' }}
                type='file'
                id='file'
                accept='.png, .jpeg, .jpg, .gif'
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                onClick={(e) => {
                  e.target.value = '';
                }}
              />
            </label>
            <div className='shareOption'>
              <RoomIcon htmlColor='brown' className='shareIcon' />
              <span className='shareOptionText'>Location</span>
            </div>
            <div className='shareOption'>
              <EmojiEmotionsOutlinedIcon
                htmlColor='goldenrod'
                className='shareIcon'
              />
              <span className='shareOptionText'>Feeling/Activity</span>
            </div>
          </div>
          <button type='submit' className='shareButton'>
            Post {<SendIcon style={{ width: '15px' }} />}
          </button>
        </form>
      </div>
    </div>
  );
}
