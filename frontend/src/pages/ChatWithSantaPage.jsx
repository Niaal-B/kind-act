import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PublicNavigationSidebar from '../components/Navigation/PublicNavigationSidebar';
import { chatAPI } from '../services/api';
import { Send, Sparkles } from 'lucide-react';
import './ChatWithSantaPage.css';

const ChatWithSantaPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadChatHistory();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await chatAPI.getHistory();
      // Backend returns messages in chronological order (oldest first)
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message optimistically
    const tempUserMsg = {
      id: Date.now(),
      message: userMessage,
      response: '',
      is_from_user: true,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await chatAPI.sendMessage(userMessage);
      
      // Replace temp message with actual response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempUserMsg.id);
        return [...filtered, response.data.user_message, response.data.santa_message];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
      
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="chat-page">
        <PublicNavigationSidebar />
        <div className="chat-content">
          <div className="chat-container">
            <div className="auth-prompt">
              <h2>🎄 Chat with Santa</h2>
              <p>Please log in to chat with Santa!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <PublicNavigationSidebar />
      <div className="chat-content">
        <div className="chat-container">
          <div className="chat-header">
            <div className="santa-avatar">
              <Sparkles className="santa-icon" />
            </div>
            <div className="chat-header-text">
              <h1>Chat with Santa</h1>
              <p>Ask me anything about Christmas or your acts of kindness!</p>
            </div>
          </div>

          <div className="messages-container">
            {loadingHistory ? (
              <div className="loading-messages">Loading chat history...</div>
            ) : messages.length === 0 ? (
              <div className="welcome-message">
                <p>🎄 Ho ho ho! Welcome, {user?.username}!</p>
                <p>I'm so excited to chat with you! Tell me about your acts of kindness or ask me anything about Christmas!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`message ${msg.is_from_user ? 'user-message' : 'santa-message'}`}
                >
                  <div className="message-content">
                    {msg.is_from_user ? (
                      <>
                        <div className="message-bubble user-bubble">
                          {msg.message}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="message-avatar">🎅</div>
                        <div className="message-bubble santa-bubble">
                          {msg.response}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message santa-message">
                <div className="message-content">
                  <div className="message-avatar">🎅</div>
                  <div className="message-bubble santa-bubble typing">
                    <span className="typing-dots">
                      <span></span><span></span><span></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message to Santa..."
              className="chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={loading || !inputMessage.trim()}
            >
              <Send className="send-icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWithSantaPage;

