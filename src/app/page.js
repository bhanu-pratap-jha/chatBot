'use client';
import React, { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: 'user', text: input }]);
    try {
      const response = await axios.post('/api/chat', { message: input });
      setMessages((prev) => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error: Unable to fetch response' }]);
    }
    setInput('');
  };

  return (
    <div className={styles.container}>
      <h1>Chatbot</h1>
      <div className={styles.chatBox}>
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
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
