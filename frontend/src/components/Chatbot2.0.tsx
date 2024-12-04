import React, { useState } from 'react';
import axios from 'axios';

const ChatBot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    const res = await axios.post('http://localhost:3000/api/chatbot', { message });
    setResponse(res.data.response);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      <div>{response}</div>
    </div>
  );
};

export default ChatBot;