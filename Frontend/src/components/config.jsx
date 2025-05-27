import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage("Hi! How can I help you?")],
  botName: "HelperBot",
};

export default config;
