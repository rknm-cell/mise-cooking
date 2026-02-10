"use client";

import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ChatFABProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnreadMessages?: boolean;
}

export function ChatFAB({ isOpen, onClick, hasUnreadMessages = false }: ChatFABProps) {
  const [shouldPulse, setShouldPulse] = useState(false);

  // Pulse animation on mount to hint at interactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldPulse(true);
      setTimeout(() => setShouldPulse(false), 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.button
      onClick={(e) => {
        console.log('ChatFAB button clicked');
        onClick();
      }}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#fcf45a] flex items-center justify-center z-50 hover:shadow-[0_20px_50px_rgba(252,244,90,0.4)] transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: shouldPulse ? [0, -8, 0, -5, 0] : 0
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        scale: {
          type: "spring",
          stiffness: 260,
          damping: 20
        },
        opacity: {
          type: "spring",
          stiffness: 260,
          damping: 20
        },
        y: {
          type: "tween",
          duration: 1.2,
          ease: "easeInOut"
        }
      }}
      aria-label={isOpen ? "Close cooking assistant" : "Open cooking assistant"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-7 h-7 text-[#1d7b86]" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <MessageCircle className="w-7 h-7 text-[#1d7b86]" />
            {hasUnreadMessages && (
              <motion.span
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#fcf45a]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#fcf45a] pointer-events-none"
        initial={{ scale: 1, opacity: 0.5 }}
        whileHover={{ scale: 1.3, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}
