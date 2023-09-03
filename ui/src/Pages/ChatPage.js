import React from 'react';
import SideMenu from '../SideMenu/SideMenu';
import Chat from '../Chat/Chat';
import Navbar from '../NavBar/NavBar';

function ChatPage() {
  return (
    <div className="container-fluid">
        <Navbar/>
      <div className="row">
        <div className="col-md-3 col-sm-12">
          <SideMenu />
        </div>
        <div className="col-md-9 col-sm-12">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
