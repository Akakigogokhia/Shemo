import React, { useEffect, useState } from 'react';
import './message.css';
import { format } from 'timeago.js';
import axios from 'axios';

function Message({ userImg, friendImg, message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className={own ? 'message own' : 'message'}>
      <div className='messageTop'>
        <img
          className='messageImg'
          src={
            own
              ? userImg
                ? PF + userImg
                : PF + 'person/noAvatar.png'
              : friendImg
              ? PF + friendImg
              : PF + 'person/noAvatar.png'
          }
        />
        <p className='messageText'>{message.text}</p>
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  );
}

export default Message;
