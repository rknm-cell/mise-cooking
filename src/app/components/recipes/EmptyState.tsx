import { Button } from "~/components/ui/button";
import { motion } from "motion/react";
import { ChefHat, Book, Sparkles } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  message?: string;
  description?: string;
  showCreateButton?: boolean;
}

export const EmptyState = ({
  message = "No recipes found",
  description = "Try adjusting your search or create a new recipe to get started",
  showCreateButton = true
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Illustration - Empty cookbook with decorative elements */}
      <div className="relative w-48 h-48 mb-6">
        {/* Main cookbook illustration */}
        <svg
          className="w-full h-full text-[#fcf45a]/30"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Closed cookbook */}
          <rect
            x="40"
            y="60"
            width="120"
            height="100"
            rx="4"
            fill="currentColor"
            className="drop-shadow-lg"
          />
          {/* Book spine detail */}
          <rect
            x="40"
            y="60"
            width="10"
            height="100"
            fill="currentColor"
            opacity="0.5"
          />
          {/* Page lines */}
          <line x1="160" y1="75" x2="160" y2="145" stroke="white" strokeWidth="2" opacity="0.3" />
          <line x1="155" y1="75" x2="155" y2="145" stroke="white" strokeWidth="1" opacity="0.2" />

          {/* Bookmark ribbon */}
          <motion.path
            d="M 95 50 L 95 80 L 105 75 L 115 80 L 115 50 Z"
            fill="#fcf45a"
            opacity="0.6"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </svg>

        {/* Floating chef hat */}
        <motion.div
          className="absolute -top-4 -right-4"
          animate={{
            y: [0, -8, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChefHat className="w-12 h-12 text-[#fcf45a]/40" strokeWidth={1.5} />
        </motion.div>

        {/* Floating sparkles */}
        <motion.div
          className="absolute -left-6 top-8"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Sparkles className="w-6 h-6 text-[#fcf45a]/50" />
        </motion.div>

        <motion.div
          className="absolute -bottom-2 -right-6"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Sparkles className="w-5 h-5 text-[#fcf45a]/40" />
        </motion.div>
      </div>

      {/* Text content */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-display text-[#fcf45a] mb-2"
      >
        {message}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/70 font-body text-center max-w-md mb-6"
      >
        {description}
      </motion.p>

      {/* Action button */}
      {showCreateButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/generate">
            <Button className="bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold shadow-yellow transition-all hover:scale-105">
              <Book className="mr-2 h-4 w-4" />
              Create Your First Recipe
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
