import { motion } from "motion/react";

interface CookingLoaderProps {
  message?: string;
  variant?: "default" | "compact";
}

export const CookingLoader = ({
  message = "Cooking up your recipe...",
  variant = "default"
}: CookingLoaderProps) => {
  const isCompact = variant === "compact";

  return (
    <div className={`flex items-center justify-center gap-3 ${isCompact ? 'py-2' : 'py-6'}`}>
      {/* Animated cooking pan with steam */}
      <div className="relative">
        {/* Pan */}
        <motion.div
          animate={{
            rotate: [-2, 2, -2],
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`${isCompact ? 'text-2xl' : 'text-4xl'}`}
        >
          🍳
        </motion.div>

        {/* Steam puffs */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -20, -40],
                scale: [0.5, 1, 1.5],
                x: [0, (i - 1) * 5, (i - 1) * 8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            >
              <div className="w-2 h-2 bg-[#fcf45a]/40 rounded-full blur-sm" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="flex flex-col items-start">
        <motion.span
          className={`font-display text-[#fcf45a] ${isCompact ? 'text-base' : 'text-lg'}`}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.span>

        {/* Animated dots */}
        {!isCompact && (
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-[#fcf45a] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional: Rotating utensils */}
      {!isCompact && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="text-2xl opacity-30"
        >
          🥄
        </motion.div>
      )}
    </div>
  );
};

// Alternative loader with progress bar enhancement
interface CookingProgressLoaderProps {
  progress?: number;
  message?: string;
}

export const CookingProgressLoader = ({
  progress = 0,
  message = "Cooking up your recipe..."
}: CookingProgressLoaderProps) => {
  return (
    <div className="w-full space-y-3">
      <CookingLoader message={message} variant="compact" />

      {/* Enhanced progress bar */}
      <div className="relative h-2 w-full bg-[#1d7b86]/30 rounded-full overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full pattern-kitchen" />
        </div>

        {/* Progress fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-[#fcf45a] to-[#fcf45a]/70 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Cooking icons along the progress bar */}
        {progress > 20 && (
          <motion.div
            className="absolute left-[20%] top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs">🥗</span>
          </motion.div>
        )}
        {progress > 50 && (
          <motion.div
            className="absolute left-[50%] top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs">🍲</span>
          </motion.div>
        )}
        {progress > 80 && (
          <motion.div
            className="absolute left-[80%] top-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs">✨</span>
          </motion.div>
        )}
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <span className="text-xs text-white/60 font-body-medium">
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
};
