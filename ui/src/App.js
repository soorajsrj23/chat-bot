import React from 'react'
import SignUp from './SignUp/SignUp'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';

import EditProfile from './Profile/EditProfile'

import Chat from './Chat/Chat'
function App() {
  return (
    <div>

<Router>
     
     <Routes>
     <Route exact path="/" element={< SignUp/>} />
     <Route path='login' element={<Login/>}/>
  
     <Route path='profile' element={<EditProfile/>}/>
    
     <Route path='chat' element={<Chat/>}/>

    
     </Routes>
     </Router>


    </div>
  )
}

export default App