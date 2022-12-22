import axios from 'axios';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (repeatPassword.current.value !== password.current.value) {
      repeatPassword.current.setCustomValidity('Passwords do not match');
    } else {
      e.preventDefault();
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post('/auth/register', user);
        navigate('/login');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className='login'>
      <div className='loginWrapper'>
        <div className='loginLeft'>
          <h3 className='loginLogo'>Shemo</h3>
          <span className='loginDesc'>
            Connect with friends, the world around you and have fun on Shemo.
          </span>
        </div>
        <div className='loginRight'>
          <form className='loginBox' onSubmit={handleSubmit}>
            <input
              required
              placeholder='Username'
              ref={username}
              className='loginInput'
            />
            <input
              placeholder='Email'
              ref={email}
              required
              className='loginInput'
              type='email'
            />
            <input
              required
              placeholder='Password'
              ref={password}
              className='loginInput'
              type='password'
            />
            <input
              required
              placeholder='Password Again'
              ref={repeatPassword}
              className='loginInput'
              type='password'
            />
            <button className='loginButton' type='submit'>
              Sign Up
            </button>
            <Link
              to='/login'
              style={{
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <button className='loginRegisterButton' type='button'>
                Log into Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
