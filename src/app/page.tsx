'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>Musika</h1>
          <p>Your Musical Instrument Assistant</p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}

