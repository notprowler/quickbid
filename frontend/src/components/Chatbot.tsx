import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';

interface Conversation {
  role: 'user' | 'model';
  text: string;
}

const formatResponse = (jsonResponse: string) => {
  try {
    // Parse the input JSON
    const parsedResponse = JSON.parse(jsonResponse);
    console.log(parsedResponse)
    // Extract the text content from the JSON structure
    const text = parsedResponse.response.candidates[0].content.parts[0].text;
    
    // Return the formatted text
    return text.trim();
  } catch (error) {
    // Handle any parsing errors
    return "Invalid JSON format.";
  }
};

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newConversation: Conversation[] = [...conversation, { role: 'user', text: input }];
    setConversation(newConversation);

    try {
      const response = await axios.post('http://localhost:3000/api/chatbot', { message: input });

      // Log the response for debugging
      console.log('AI Response:' , response.data);

      // Format the AI response
      if (response.data && response.data.response) {
        // Add AI response to conversation with the correct role
        const formattedResponse = formatResponse(response.data.response);
        setConversation([...newConversation, { role: 'model', text: formattedResponse }]);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error handling chatbot request:', error);
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  useEffect(() => {
    const scrollChat = () => {
      const chatBox = document.querySelector('.chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    };
    scrollChat();
  }, [conversation]);

  return (
    <Box sx={{ fontFamily: 'Arial, sans-serif' }}>
    <Box sx={{ padding: '25px', border: '2px solid black', borderRadius: '16px', width: '600px', margin: 'auto', marginTop: '50px', backgroundColor: '#fff' }}>
      <AppBar position="static" sx={{ backgroundColor: '#3A5B22', borderRadius: '16px 16px 0 0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Chatbot
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className="chat-box" sx={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '10px', padding: '10px' }}>
        {conversation.map((conv, index) => (
          <Box key={index} sx={{ marginBottom: '10px', textAlign: conv.role === 'user' ? 'right' : 'left' }}>
            <Paper
              elevation={3}
              sx={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '20px',
                textcolor: 'white',
                backgroundColor: conv.role === 'user' ? '#758c64' : '#3A5B22',
                maxWidth: '80%',
              }}
            >
              <Typography variant="body1" sx={{ color: 'white' }}>
                {conv.text}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        sx={{ marginBottom: '10px' }}
      />
      <Button variant="contained" sx={{ backgroundColor: '#3A5B22', color: 'white' }} fullWidth onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </Button>
    </Box>
  </Box>
  );
};

export default Chatbot;