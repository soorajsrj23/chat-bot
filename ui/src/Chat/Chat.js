import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);
    
    newSocket.on('message', (data) => {
      setChat([...chat, { text: data, user: 'bot' }]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', message);
      setChat([...chat, { text: message, user: 'user' }]);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            {msg.user}: {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
