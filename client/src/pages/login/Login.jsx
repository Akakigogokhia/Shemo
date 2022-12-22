import { useContext, useRef } from 'react';
import './login.css';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, loading, error, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
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
              placeholder='Email'
              type='email'
              required
              className='loginInput'
              ref={email}
            />
            <input
              ref={password}
              minLength={6}
              placeholder='Password'
              required
              type='password'
              className='loginInput'
            />
            <button className='loginButton' type='submit' disabled={loading}>
              {loading ? (
                <CircularProgress style={{ color: 'white', size: '20px' }} />
              ) : (
                'Log In'
              )}
            </button>
            <span className='loginForgot'>Forgot Password?</span>
            <Link
              to='/register'
              style={{
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <button className='loginRegisterButton' type='button'>
                {loading ? (
                  <CircularProgress style={{ color: 'white', size: '20px' }} />
                ) : (
                  'Create new account'
                )}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
