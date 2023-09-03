import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SideMenu.css';

function SideMenu() {
  const [showButton, setShowButton] = useState(window.innerWidth <= 768);
  const [showOptions, setShowOptions] = useState(window.innerWidth > 768);
  const [theme, setTheme] = useState('light'); // Initialize with 'light' theme
  const [showAboutModal, setShowAboutModal] = useState(false);

  const openAboutModal = () => {
    setShowAboutModal(true);
  };

  const closeAboutModal = () => {
    setShowAboutModal(false);
  };


  const API_BASE = "http://localhost:4000";

  const [profile, setProfile] = useState({});
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(API_BASE + "/current-user", {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      // If the API call is successful, set the data to the state
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const toggleTheme = () => {
    // Toggle between 'light' and 'dark' themes
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // You can apply the new theme to your entire website here
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  }

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768;
      setShowButton(isSmallScreen);
      setShowOptions(!isSmallScreen);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="side-menu">
      {/* Button to toggle options on small screens */}
      {showButton && (
        <button
          className={`toggle-button ${showOptions ? 'active' : ''}`}
          onClick={toggleOptions}
        >
          {showOptions ? 'x' : '='}
        </button>
      )}

      {/* Options (conditionally visible based on showOptions state) */}
      {showOptions && (
        <div className="options">
          <ul>
            <li onClick={openAboutModal}>About</li>
            {showAboutModal && (
        <div className="about-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeAboutModal}>
              &times;
            </span>
            <h2>About EmoCoach</h2>
            <p>MentalWellBot is a virtual companion dedicated to supporting users in their mental health journeys. It is designed to address various mental health concerns, including stress, anxiety, depression, loneliness, and more. The chatbot's core purpose is to create a safe and accessible space for individuals to seek information, assistance, and emotional support.</p>
          </div>
        </div>
      )}
            <li>Edit Profile</li>
            <li onClick={toggleTheme}>Change Theme</li>
          </ul>
        
      <div className="profile-section">
        <div className="profile-image">
        {profile.image && (
          <div className="user-image">
            <img src={`data:${profile.image.contentType};base64,${profile.image.data}`} alt="User" className="rounded-circle" />
          </div>
        )}
        </div>
        <div className="profile-info">
          <h3>{profile.name}</h3>
          <p>{profile.email}</p>
          {/* Add more profile information as needed */}
        </div>
      </div>
      </div>
      )}
      
    </div>
  );
}

export default SideMenu;
