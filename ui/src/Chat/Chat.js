import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios'; // Import axios for making HTTP requests

import './Chat.css'; // Import your CSS file

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [previousMessages, setPreviousMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      setChat([...chat, { text: data, user: 'bot' }]);
    });

    // Fetch previous chat messages with authorization token
    const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
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
    <div className="chat-container">
      <div className="chat-messages">
        <div className="previous-messages">
          {previousMessages.map((msg, index) => (
            <div key={index} className="previous-message user-message">
              You: {msg}
            </div>
          ))}
        </div>
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
          className="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
