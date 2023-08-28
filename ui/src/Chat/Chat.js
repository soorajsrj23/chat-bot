import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Result from '../Assets/result.png'
import chatBotImg from '../Assets/intro.png';
import cryingAvatar from '../Assets/sad.png';
import laughingAvatar from '../Assets/happy.png';
// ... Import other avatar images
import './Chat.css';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [previousMessages, setPreviousMessages] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState('');

  const defaultEmotion = 'neutral';


  const emotionAvatarMap = {
    Depression: cryingAvatar,
    PositiveDistractions: laughingAvatar,
    Greeting:chatBotImg,

    // ... Add other emotions and their corresponding avatar images
    neutral: Result,
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      const { intent, message } = data;
      setChat([...chat, { text: message, user: 'bot', intent }]);
      setDetectedEmotion(intent);
    });

    const token = localStorage.getItem('authToken');
    axios.get('/previousChat', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPreviousMessages(response.data.messages);
      })
      .catch(error => {
        console.error(error);
      });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', message);
      setChat([...chat, { text: message, user: 'user' }]);
      setPreviousMessages([...previousMessages, message]);
      setMessage('');
    }
  };

  return (
    <div className="container chat-container">
      <div className="row">
        <div className="col-md-6 chat-section chat-image">
        <img
            src={emotionAvatarMap[detectedEmotion] || emotionAvatarMap[defaultEmotion]}
            alt="Chatbot"
            className="img-fluid"
          />
        </div>
        <div className="col-md-6 chat-section chat-messages">
          <div className="chat-header">
            <h2 className="chat-title">Futuristic Chatbot</h2>
          </div>
          <div className="chat-messages">
            {/* Previous chat messages */}
            <div className="previous-messages">
              {previousMessages.map((msg, index) => (
                <div key={index} className="previous-message user-message">
                  You: {msg}
                </div>
              ))}
            </div>
            {/* Current chat messages */}
            <div className="current-messages">
              {chat.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.user}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          <div className="input-container">
            <input
              className="form-control message-input"
              type="text"
              value={message}
              placeholder="Type your message here..."
              onChange={(e) => setMessage(e.target.value)}
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
