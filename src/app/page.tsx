'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>AI Assistant</h1>
          <p>Powered by Flowise RAG Chatbot</p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}

