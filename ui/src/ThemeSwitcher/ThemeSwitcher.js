import React, { useState } from 'react';
import './ThemeSwitcher.css'; // Import your CSS styles

function ThemeSwitcher() {
  // Step 2: Define a state variable for the theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Step 3: Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div>
      {/* Step 4: Conditional rendering based on the theme */}
      <div className={`app ${isDarkTheme ? 'dark' : 'light'}`}>
        <header>
          <h1>My App</h1>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </header>
        <main>
          {/* Your app content */}
          <p>This is your app content.</p>
        </main>
      </div>
    </div>
  );
}

export default ThemeSwitcher;
