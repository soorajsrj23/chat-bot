import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios'; // Import axios for making HTTP requests
import chatBotImg from '../Assets/chatbotImg.png'
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
    <div className="container chat-container">
      <div className="row">
        <div className="col-md-6 chat-section chat-image">
          <img src={chatBotImg} alt="Chatbot" className="img-fluid" />
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
