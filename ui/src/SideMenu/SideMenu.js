import React, { useState, useEffect } from 'react';
import './SideMenu.css'
function SideMenu() {
  const [showButton, setShowButton] = useState(window.innerWidth <= 768);
  const [showOptions, setShowOptions] = useState(window.innerWidth > 768);

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
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SideMenu;
