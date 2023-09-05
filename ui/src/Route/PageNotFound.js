import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.css'
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-message">
          The page you are looking for does not exist.
        </p>
        <Link to="/login" className="not-found-link">
          Go back to the home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
