import React from 'react';
import './home.css';
import Feed from '../../components/feed/Feed';
import Header from '../../components/header/Header';
import SideBar from '../../components/sidebar/SideBar';
import Rightbar from '../../components/rightbar/Rightbar';

function Home() {
  return (
    <>
      <Header />
      <div className='homeContainer'>
        <SideBar />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
}

export default Home;
