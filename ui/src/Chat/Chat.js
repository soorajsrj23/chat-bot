import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useRef } from 'react';

import anxious from '../Assets/anxious.png';
import laughingAvatar from '../Assets/happy.png';
import userIcon from '../Assets/userIcon.jpeg';
import confused from '../Assets/confused.png';
import love from '../Assets/love.png'
import angry from '../Assets/angry.png'
import understand from '../Assets/ooo.png'
import happy from '../Assets/happy.png'
import './Chat.css';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [currentUser,setCurrentUser]=useState({});
  const defaultEmotion = 'neutral';
  const chatMessagesRef = useRef(null);
 
  const getUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/current-user', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

        // If the API call is successful, set the data to the state
        setCurrentUser(response.data);
        console.log("data fetched successfully"+currentUser._id);

    } catch (error) {
      console.error(error);
    }
  };

useEffect(()=>{
  getUserInfo();

},[])

  const emotionAvatarMap = {
    Depression: anxious,
    PositiveDistractions: laughingAvatar,
    neutral: laughingAvatar,
    CustomResponse:confused,
    PositiveAffirmations:love,
    thanks:love,
    Resources:understand
  };

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      const { intent, message, user } = data;
      const newChatEntry = { text: message, user, intent };
      setChats((prevChats) => [...prevChats, newChatEntry]);
      setDetectedEmotion(intent);
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    });

    axios
      .get('http://localhost:4000/previousChat', {
        headers: {
          Authorization: localStorage.getItem('token'),
        }})
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
      socket.emit('message', { text: message, user: 'user',sender:currentUser._id });
      const newChatEntry = { text: message, user: 'user' };
      setChats((prevChats) => [...prevChats, newChatEntry]);
      setMessage('');
      
    }
  };
 

  return (
   
    <div className="container-fluid chat-container ">
   
      <div className="row">
        <div className="col-md-12 chat-section chat-messages">
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
              className=" message-input"
              type="text"
              value={message}
              placeholder="   Type your message here..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-primary btn-lg send-button " onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default ChatComponent;
