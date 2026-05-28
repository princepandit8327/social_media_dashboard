import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

const LiveChat = ({ recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.recipientId === recipientId || message.senderId === recipientId) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, [recipientId]);

  const submit = () => {
    if (!content.trim()) return;
    socket.emit('sendMessage', { recipientId, content });
    setMessages((prev) => [...prev, { recipientId, content, createdAt: new Date() }]);
    setContent('');
  };

  return (
    <section className="card chat-card">
      <h3>Live chat</h3>
      <div className="chat-log">
        {messages.map((message, idx) => (
          <div key={idx} className="chat-message">
            <span>{message.content}</span>
            <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a message..." />
        <button onClick={submit}>Send</button>
      </div>
    </section>
  );
};

export default LiveChat;
