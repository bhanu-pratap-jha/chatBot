'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');

    try {
      const response = await axios.post('/api/chat', { message: trimmed });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error: Unable to fetch response' }]);
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <h1>Chatbot</h1>

      <div className={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? styles.user : styles.bot}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.inputBox}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
