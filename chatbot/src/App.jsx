import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://portfolio-backend-d8e1.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await res.json();

      if (data.answer) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ No answer found." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not connect to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="navbar-title">Amir's AI Assistant</div>
      </nav>

      <header className="intro">
        <h1>Welcome to my smart resume assistant</h1>
        <p>Ask anything about Amir’s professional experience, skills, and projects.</p>
      </header>

      <div className="chat-container">
        <motion.div
          className="chat-window"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`message ${msg.sender}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              className="message bot typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Typing...
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </motion.div>
        <div className="input-bar">
          <input
            type="text"
            placeholder="Ask me about my resume..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <p>!!! Sometimes it may not answer exactly to the question as it has data of only my resume</p>
      </div>
    </div>
  );
}
