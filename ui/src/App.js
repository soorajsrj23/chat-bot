import React from 'react';
import SignUp from './SignUp/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import EditProfile from './Profile/EditProfile';
import AuthenticatedRoute from './Route/AuthenticatedRoute';
import ChatPage from './Pages/ChatPage';
import PageNotFound from './Route/PageNotFound'
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<AuthenticatedRoute><EditProfile /></AuthenticatedRoute>} />
          <Route path="chat" element={<AuthenticatedRoute><ChatPage /></AuthenticatedRoute>} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
