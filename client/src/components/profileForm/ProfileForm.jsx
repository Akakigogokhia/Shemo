import axios from 'axios';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './profileForm.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ProfileForm({ user, currentUser }) {
  const [password, setPassword] = useState(null);
  const [pass, setPass] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [coverPic, setCoverPic] = useState('');
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState('');

  const [info, setInfo] = useState({
    desc: '',
    city: '',
    from: '',
    relationship: '',
  });
  const [newUser, setNewUser] = useState({
    userId: user._id,
    profilePicture: null,
    coverPicture: null,
  });

  useEffect(() => {
    if (user._id === currentUser._id)
      localStorage.setItem('user', JSON.stringify(user));
  }, [user, currentUser]);

  //Profile picture
  const uploadProfile = async (updatedUser) => {
    const data = new FormData();
    const fileName = Date.now() + profilePic.name;
    data.append('name', fileName);
    data.append('file', profilePic);

    setNewUser({
      ...newUser,
      profilePicture: fileName,
    });

    updatedUser.profilePicture = fileName;
    try {
      await axios.post('/upload', data);
    } catch (err) {}
  };

  //Cover update
  const uploadCover = async (updatedUser) => {
    const data = new FormData();
    const fileName = Date.now() + coverPic.name;
    data.append('name', fileName);
    data.append('file', coverPic);

    updatedUser.coverPicture = fileName;
    try {
      await axios.post('/upload', data);
    } catch (err) {}
  };

  //Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    let updatedUser = { ...newUser };

    updatedUser.userId = user._id;
    if (profilePic) uploadProfile(updatedUser);
    if (coverPic) uploadCover(updatedUser);

    if (!updatedUser.profilePicture) {
      updatedUser.profilePicture = user.profilePicture;
    }
    if (!updatedUser.coverPicture) {
      updatedUser.coverPicture = user.coverPicture;
    }
    Object.keys(info).map((key) => {
      if (info[key].length > 0) {
        updatedUser[key] = info[key];
      }
    });

    try {
      await axios.put('/users/' + user._id, updatedUser);
    } catch (error) {}

    if (password) {
      if (password.length > 5) {
        updatedUser.password = password;
        if (user._id === currentUser._id)
          localStorage.setItem('user', JSON.stringify(user));
        window.location.reload();
      } else {
        setError('Password is too short');
        return true;
      }
    } else {
      if (user._id === currentUser._id)
        localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
    }
  };

  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <div className='uploadInput'>
        <label>
          <span>
            {!profilePic ? 'Change profile picture' : <CheckCircleIcon />}
          </span>
          <input
            name='cover'
            type='file'
            className='upload'
            accept='.png, .jpeg, .jpg, .gif'
            onChange={(e) => {
              setProfilePic(e.target.files[0]);
            }}
          />
        </label>
      </div>
      <div className='uploadInput'>
        <label>
          <span>
            {!coverPic ? 'Change cover picture' : <CheckCircleIcon />}
          </span>
          <input
            name='profile'
            type='file'
            className='upload'
            accept='.png, .jpeg, .jpg, .gif'
            onChange={(e) => {
              setCoverPic(e.target.files[0]);
            }}
          />
        </label>
      </div>
      <div className='uploadInput'>
        <label>
          {!update ? (
            <span onClick={() => setUpdate(true)}>Change information</span>
          ) : (
            <div>
              <label>Description</label>
              <input
                onChange={(e) =>
                  setInfo({
                    ...info,
                    desc: e.target.value,
                  })
                }
              ></input>
              <label>City</label>
              <input
                onChange={(e) =>
                  setInfo({
                    ...info,
                    city: e.target.value,
                  })
                }
              ></input>
              <label>From</label>
              <input
                onChange={(e) =>
                  setInfo({
                    ...info,
                    from: e.target.value,
                  })
                }
              ></input>
              <label>Relationship</label>
              <input
                onChange={(e) =>
                  setInfo({
                    ...info,
                    relationship: e.target.value,
                  })
                }
              ></input>
            </div>
          )}
        </label>
      </div>
      <div className='uploadInput'>
        {!pass ? (
          <label onClick={() => setPass(true)}>Change password</label>
        ) : (
          <>
            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type='password'
            ></input>
            <small>{error}</small>
          </>
        )}
      </div>

      <button
        disabled={newUser.password?.length <= 4}
        type='submit'
        className='submitButton'
      >
        Save changes
      </button>
    </form>
  );
}

export default ProfileForm;
