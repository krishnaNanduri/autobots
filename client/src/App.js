import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './App.css';
import config from './chatBot/config.js';
import ActionProvider from './chatBot/ActionProvider.jsx';
import MessageParser from './chatBot/MessageParser.jsx';

function App() {
  const [bot, setBot] = useState(false);
  return (
    <div className='wrapper'>
      <div style={{ display: bot ? 'block' : 'none', marginRight: '30px' }}>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          headerText='Autobot Chat'
        />
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '5px',
          margin: '30px',
        }}
      >
        <img
          src='robo_round.png'
          alt='Autobot'
          width={'60px'}
          onClick={() => setBot(!bot)}
        />
      </div>
    </div>
  );
}

export default App;