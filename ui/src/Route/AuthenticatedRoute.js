import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const history = useNavigate();

  // Function to check if a JWT token exists in localStorage
  const isTokenAvailable = () => {
    const token = localStorage.getItem('token'); // Change 'token' to your token key
    return token !== null && token !== undefined;
  };

  useEffect(() => {
    // Check if the token is available
    if (isTokenAvailable()) {
      // Token is available, redirect to the '/chat' route
      history('/chat');
    } else {
      // Token is not available, redirect to the '/login' route
      history('/login');
    }
  });

  // Render the children components
  return <>{children}</>;
};

export default AuthenticatedRoute;
