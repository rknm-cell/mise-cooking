'use client';

import { useChat } from 'ai/react';

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  console.log(messages)

  return (
    <div className="flex h-[600px] w-full max-w-2xl flex-col rounded-xl bg-white/10 p-4">
      <div className="mb-4 flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-[hsl(280,100%,70%)] text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-white/20 px-4 py-2 text-white">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/50" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about recipes..."
          className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-[hsl(280,100%,70%)] px-4 py-2 font-semibold text-white hover:bg-[hsl(280,100%,60%)] focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)] disabled:opacity-50 disabled:hover:bg-[hsl(280,100%,70%)]"
        >
          Send
        </button>
      </form>
    </div>
  );
} 