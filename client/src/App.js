import React, { useContext } from 'react';
import './app.css';
import Home from './pages/home/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import { AuthContext } from './context/AuthContext';
import Chat from './pages/chat/Chat';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Register />}></Route>
        <Route
          path='/login'
          element={user ? <Navigate to='/' /> : <Login />}
        ></Route>
        <Route
          path='/register'
          element={user ? <Navigate to='/' /> : <Register />}
        ></Route>
        <Route
          path='/chat'
          element={!user ? <Navigate to='/register' /> : <Chat />}
        ></Route>
        <Route
          path='/profile/:username'
          element={user ? <Profile /> : <Login />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
