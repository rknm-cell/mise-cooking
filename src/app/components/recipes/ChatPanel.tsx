"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Send, ChefHat, Sparkles, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type RecipeSchema } from "~/server/db/schema";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RecipeSchema;
}

export function ChatPanel({ isOpen, onClose, recipe }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Contextual quick questions based on recipe
  const quickQuestions = [
    "What can I substitute for ingredients?",
    `How do I ${recipe.instructions?.[0]?.split(' ').slice(0, 5).join(' ') || 'start cooking'}?`,
    "Can I make this ahead of time?",
    "How do I store leftovers?",
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    console.log('ChatPanel isOpen changed to:', isOpen);
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hi! I'm your cooking assistant for **${recipe.name}**. I can help with techniques, substitutions, timing, and any questions you have while cooking. What would you like to know?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, recipe.name, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/cooking-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          recipeName: recipe.name,
          recipeDescription: recipe.description,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[440px] bg-[#428a93] shadow-2xl z-50 flex flex-col border-l-4 border-[#fcf45a]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-[#fcf45a]/30 bg-[#1d7b86]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#fcf45a] flex items-center justify-center shadow-lg">
                  <ChefHat className="w-5 h-5 text-[#1d7b86]" />
                </div>
                <div>
                  <h2 className="text-white font-display text-lg">Cooking Assistant</h2>
                  <p className="text-white/60 text-xs font-body">Ask me anything</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#fcf45a]/20 text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 texture-paper">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 shadow-md",
                      message.role === 'user'
                        ? "bg-[#fcf45a] text-[#1d7b86] rounded-br-sm"
                        : "bg-[#1d7b86] text-white rounded-bl-sm border border-[#fcf45a]/20"
                    )}
                  >
                    <p className="text-sm font-body leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <time className={cn(
                      "text-[10px] mt-1 block font-mono",
                      message.role === 'user' ? "text-[#1d7b86]/60" : "text-white/50"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1d7b86] text-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md border border-[#fcf45a]/20">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-body">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions - Only show when no messages yet */}
            {messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 pb-3 space-y-2"
              >
                <p className="text-xs text-white/60 font-body-semibold uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#1d7b86] border border-[#fcf45a]/30 text-white hover:border-[#fcf45a] hover:bg-[#1d7b86]/80 transition-all font-body"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t-2 border-[#fcf45a]/30 bg-[#1d7b86]">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about techniques, substitutions, timing..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[#428a93] border-2 border-[#fcf45a]/30 focus:border-[#fcf45a] focus:outline-none text-white placeholder:text-white/40 font-body resize-none transition-all"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="self-end px-4 py-3 rounded-lg bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-yellow"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-white/50 mt-2 font-body">
                Press <kbd className="px-1.5 py-0.5 rounded bg-[#428a93] border border-white/20 font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-[#428a93] border border-white/20 font-mono">Shift + Enter</kbd> for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
