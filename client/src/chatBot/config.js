import { createChatBotMessage } from 'react-chatbot-kit';
import Options from '../components/Options/Options';

const config = {
  initialMessages: [createChatBotMessage(`Hello world`)],
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => <Options {...props} />,
    },
  ],
};

export default config;
