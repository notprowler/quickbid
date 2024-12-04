import React, { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newUserMessage: Message = {
      sender: "user",
      text: input,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const newBotMessage: Message = {
        sender: "bot",
        text: `You said: ${input}`,
      };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    }, 1000); // Simulate bot response delay
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="sticky top-0 bg-[#3a5b22] p-4 text-center text-xl font-bold text-white">
        QuickBid
      </div>

      {/* Chatbot Container */}
      <div className="chatbot-container mt-16">
        {/* Message Display */}
        <div className="message-display h-96 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message mb-2 ${
                msg.sender === "bot"
                  ? "bg-[#3a5b22] text-white"
                  : "bg-gray-100 text-gray-700"
              } rounded-lg p-3`}
            >
              <p className="font-bold">
                {msg.sender === "bot" ? "Bot:" : "You:"}
              </p>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="message-input flex items-center space-x-2 rounded-lg bg-gray-100 p-4">
          <input
            type="text"
            className="message-input-field flex-1 rounded border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="send-button rounded-lg bg-[#3a5b22] px-4 py-2 text-white hover:bg-[#034605]"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;