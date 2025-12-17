'use client';

import { useState, useRef, useEffect } from 'react';
import { flowiseService, ChatMessage } from '@/services/flowiseService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    pageContent: string;
    metadata: { [key: string]: any };
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build history from previous messages
      const history: Array<{ question: string; answer: string }> = [];
      for (let i = 0; i < messages.length; i += 2) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'assistant') {
          history.push({
            question: messages[i].content,
            answer: messages[i + 1].content,
          });
        }
      }

      const response = await flowiseService.sendMessage(userMessage.content, history);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        sources: response.sourceDocuments,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response. Please check your Flowise configuration.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to get response. Please check your Flowise configuration.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-robot empty-state-icon"></i>
            <h2>Welcome to AI Assistant</h2>
            <p>
              Ask me anything! I'm powered by Flowise with RAG capabilities to provide
              accurate and contextual responses.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.role}`}
          >
            {message.role === 'assistant' && (
              <div className="avatar assistant">
                <i className="fas fa-robot icon icon-small"></i>
              </div>
            )}

            <div className={`message-bubble ${message.role}`}>
              <p className="message-content">{message.content}</p>
              
              {message.sources && message.sources.length > 0 && (
                <div className="sources">
                  <p className="sources-title">
                    <i className="fas fa-sticky-note icon icon-small"></i> Sources:
                  </p>
                  <div>
                    {message.sources.slice(0, 3).map((source, idx) => (
                      <div key={idx} className="source-item">
                        <i className="fas fa-file-alt icon icon-small"></i> {source.pageContent.substring(0, 100)}...
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="timestamp">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="avatar user">
                <i className="fas fa-user icon icon-small"></i>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="loading-wrapper">
            <div className="avatar assistant">
              <i className="fas fa-robot icon icon-small"></i>
            </div>
            <div className="loading-bubble">
              <div className="spinner"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="input-field"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <i className="fas fa-paper-plane icon icon-medium"></i>
                <span className="send-button-text">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

