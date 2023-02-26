import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  useEffect(() => {
    socket.on('connect', () => {});
    socket.on('disconnect', () => {});
    socket.on('from_bot', (message) => {
      console.log('server_Response', message);
      postServerMessage(message);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('from_bot');
    };
  });

  const postServerMessage = (message) => {
    const messages = message.message;
    const response = messages.find((msg) => {
      return msg.quickReplies;
    });
    if (response) {
      createOptionsMessage(messages);
    } else {
      createMessage(messages);
    }
  };

  const getTextMessage = (messages) => {
    let response = messages.filter(message => message.text).map(message => message.text.text[0]);
    return response.join("\n")
  }

  const createMessage = (messages) => {
    const textMessage = getTextMessage(messages);
    const botMessage = createChatBotMessage(textMessage);
    saveMessage(botMessage);
  };

  const createOptionsMessage = (messages) => {
    const textMessage = getTextMessage(messages);
    const botMessage = createChatBotMessage(textMessage, {
      widget: 'options',
      payload: {
        options: messages[1].quickReplies,
      },
    });
    saveMessage(botMessage);
  };

  const saveMessage = (botMessage) => {
    setState((prev) => {
      return {
        messages: [...prev.messages, botMessage],
      };
    });
  };

  const handleMessage = (message, from) => {
    console.log('message details', message, from);
    if (message === 'more') {
      console.log('open');
      window.open('http://localhost:8080/loads', '_blank');
      return;
    }
    if(from === 'options') {
      socket.emit('to_bot', { message: `Load details of ${message}`})
    } else {
      socket.emit('to_bot', { message });
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMessage,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
