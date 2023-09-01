import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useRef } from 'react';

import anxious from '../Assets/anxious.png';
import laughingAvatar from '../Assets/happy.png';
import userIcon from '../Assets/userIcon.jpeg';
import './Chat.css';
import Navbar from '../NavBar/NavBar';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const defaultEmotion = 'neutral';
  const chatMessagesRef = useRef(null);
 

  const emotionAvatarMap = {
    Depression: anxious,
    PositiveDistractions: laughingAvatar,
    neutral: laughingAvatar,
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      const { intent, message, user } = data;
      const newChatEntry = { text: message, user, intent };
      setChats((prevChats) => [...prevChats, newChatEntry]);
      setDetectedEmotion(intent);
    });

    axios
      .get('http://localhost:4000/previousChat')
      .then((response) => {
        setChats(response.data.chats);
      })
      .catch((error) => {
        console.error(error.message);
      });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', { text: message, user: 'user' });
      const newChatEntry = { text: message, user: 'user' };
      setChats((prevChats) => [...prevChats, newChatEntry]);
      setMessage('');
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  return (
   
    <div className="container-fluid chat-container ">
      <Navbar/>
      <div className="row">
        <div className="col-md-12 chat-section chat-messages">
          <div className="chat-header">
            <h2 className="chat-title">Futuristic Chatbot</h2>
           
          </div>
          <div className="chat-messages"  ref={chatMessagesRef} >
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`chat-message ${
                  chat.user === 'user' ? 'user' : 'bot'
                }`}
               
              >
                <div className={`${chat.user === 'user' ? 'user' : 'bot'}-icon`}>
                  <img
                    src={
                      chat.user === 'user'
                        ? userIcon
                        : emotionAvatarMap[chat.intent] ||
                          emotionAvatarMap[defaultEmotion]
                    }
                    alt={chat.user}
                  />
                </div>
                <div className={`${chat.user === 'user' ? 'user' : 'bot'}-message`}  >
                  {chat.text || chat.message}
                </div>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              className="form-control message-input"
              type="text"
              value={message}
              placeholder="Type your message here..."
              onChange={(e) => setMessage(e.target.value)}
              required 
            />
            <button className="btn btn-primary send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default ChatComponent;
