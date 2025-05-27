import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../components/config';
import MessageParser from '../components/MessageParser';
import ActionProvider from '../components/ActionProvider';
import { Link } from 'react-router-dom';


export default function ShopFooter() {
  const [showBot, setShowBot] = useState(false);

  return (
    <>
    <Link to={"/shop/Ai"}>
      <div
        // onClick={() => setShowBot(!showBot)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#0d6efd',
          color: '#fff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 999
        }}
      >
        <i className="bi bi-chat-dots-fill"></i>
      </div>
      </Link>

      {/* Chatbot Widget */}
      {/* {showBot && (
        <div style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 999 }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )} */}

      {/* Footer */}
      <div id="footer-bottom">
        <div className="container-lg">
          <div className="row">
            <div className="col-md-6 copyright">
              <p>© 2024 stockmate. All rights reserved.</p>
            </div>
            <div className="col-md-6 credit-link text-start text-md-end">
              <p>Designed By Aryan</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
