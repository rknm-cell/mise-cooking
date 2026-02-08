"use client";

import { useEffect, useState, useRef } from "react";
import RecipeDetail from "~/app/components/recipes/RecipeDetail";
import { CookingProgressLoader } from "~/app/components/recipes/CookingLoader";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { recipe, type RecipeSchema } from "~/server/db/schema";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChefHat, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Quick suggestion prompts for inspiration
const QUICK_PROMPTS = [
  "A hearty Italian pasta with fresh tomatoes",
  "Quick 15-minute healthy dinner",
  "Vegetarian comfort food for a rainy day",
  "Spicy Asian-inspired stir-fry",
  "Light Mediterranean salad bowl",
];

export default function RecipeGenerator() {
  const [generation, setGeneration] = useState<RecipeSchema | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'none' | 'saved' | 'error'>('none');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const totalDuration = 10000;
  const updateInterval = 100;
  const maxChars = 500;

  useEffect(() => {
    if (!isLoading) return;
    
    const increment = (100 / totalDuration) * updateInterval;
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isLoading && input.trim()) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, isLoading]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= maxChars) {
      setInput(value);
      setError(null);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleClearInput = () => {
    setInput('');
    setError(null);
    textareaRef.current?.focus();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    try {
      setGeneration(undefined);
      setIsLoading(true);
      setProgress(0);
      setSaveStatus('none');

      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe. Please try again.');
      }

      const recipeData: RecipeSchema = await response.json();
      setGeneration(recipeData);

      const assistantMessage = `Generated recipe: ${recipeData.name} - ${recipeData.description}`;
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage }
      ]);

      setIsLoading(false);
    } catch (error) {
      const e = error as Error;
      console.error("Error generating recipe:", e);
      setError(e.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      setInput(userMessage); // Restore input on error
    }
  }

  const clearConversation = () => {
    setConversationHistory([]);
    setGeneration(undefined);
    setSaveStatus('none');
  };

  const saveRecipe = async (recipe: RecipeSchema) => {
    if (!recipe) return;
    
    setIsSaving(true);
    setSaveStatus('none');
    
    try {
      // For now, we'll just simulate saving
      // In a real implementation, you'd call your save API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveStatus('saved');
      console.log('Recipe saved successfully!');
    } catch (error) {
      setSaveStatus('error');
      console.error('Failed to save recipe:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const startCookingSession = () => {
    if (!generation) return;
    
    // TODO: Implement cooking session logic
    console.log('Starting cooking session for:', generation.name);
    alert('Starting a new cooking session...');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-2xl"
      >
        {/* Decorative floating elements */}
        <motion.div
          className="absolute -top-8 -left-8 text-[#fcf45a]/20 pointer-events-none hidden sm:block"
          animate={{
            rotate: [0, -10, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          
        </motion.div>

        <Card className="relative bg-[#428a93] border-[#fcf45a] border-2 texture-paper shadow-ocean-lg overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-display text-[#fcf45a] text-center">
              What's cooking?
            </CardTitle>
            <p className="text-white/70 text-center text-sm font-body mt-1">
              {conversationHistory.length > 0
                ? "Refine your recipe or ask follow-up questions"
                : "Tell me what you'd like to cook, and I'll create a recipe for you"
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick Prompts - Only show when no conversation history */}
            {conversationHistory.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="text-xs text-white/60 font-body-semibold uppercase tracking-wide">
                  Try these ideas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleQuickPrompt(prompt)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[#1d7b86] border border-[#fcf45a]/30 text-white hover:border-[#fcf45a] hover:bg-[#1d7b86]/80 transition-all font-body"
                    >
                      <Sparkles className="h-3 w-3 text-[#fcf45a]" />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Textarea field with enhanced UX */}
              <div className="relative">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={conversationHistory.length > 0
                      ? "Make it spicier, add more vegetables, change the protein..."
                      : "Describe what you'd like to cook... Be specific about flavors, dietary needs, or cooking time!"
                    }
                    className={cn(
                      "w-full min-h-[100px] max-h-[200px] rounded-lg bg-[#1d7b86] border-2 px-4 py-3 text-white placeholder:text-white/40 font-body focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none",
                      isFocused ? "border-[#fcf45a] ring-2 ring-[#fcf45a]/20" : "border-[#fcf45a]/30",
                      error && "border-red-400 ring-2 ring-red-400/20"
                    )}
                    disabled={isLoading}
                    rows={3}
                  />

                  {/* Clear button */}
                  {input && !isLoading && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute top-3 right-3 p-1 rounded-md bg-[#1d7b86]/80 hover:bg-[#fcf45a] text-white/60 hover:text-[#1d7b86] transition-all"
                      aria-label="Clear input"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Character counter and keyboard hint */}
                <div className="flex items-center justify-between mt-1.5 px-1">
                  <div className={cn(
                    "text-xs font-mono transition-colors",
                    input.length > maxChars * 0.9 ? "text-[#fcf45a]" : "text-white/50"
                  )}>
                    {input.length}/{maxChars}
                  </div>
                  {!isLoading && (
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-white/50 bg-[#1d7b86]/50 rounded border border-white/10">
                      <span>⌘</span>
                      <span>Enter</span>
                      <span className="text-white/30 ml-1">to submit</span>
                    </kbd>
                  )}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit button with playful styling */}
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-full rounded-lg bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 disabled:opacity-50 disabled:cursor-not-allowed font-body-bold text-lg py-6 shadow-yellow transition-all relative overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <ChefHat className="h-5 w-5" />
                      {conversationHistory.length > 0 ? "Refine Recipe" : "Generate Recipe"}
                    </span>
                  </Button>
                </motion.div>
              )}
            </form>

            {/* Loading indicator */}
            <AnimatePresence>
              {isLoading && !generation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CookingProgressLoader
                    progress={progress}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

        </Card>
      </motion.div>

      {/* Conversation History Indicator
      {conversationHistory.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto mt-4 bg-[#428a93] border-[#fcf45a]">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-[#fcf45a] text-sm">
                Conversation History ({conversationHistory.length} messages)
              </CardTitle>
              <Button
                onClick={clearConversation}
                variant="ghost"
                size="sm"
                className="text-[#fcf45a] hover:bg-[#fcf45a]/20"
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {conversationHistory.slice(-3).map((message, index) => (
                <div key={index} className="text-xs text-white opacity-80">
                  <span className="font-semibold">{message.role}:</span> {message.content}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}

      <AnimatePresence mode="wait">
        {generation && (
          <motion.div
            key={generation.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto mt-4"
          >
            {/* Recipe Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
            >
              <Card className="mb-4 bg-[#428a93] border-[#fcf45a] texture-paper shadow-ocean">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#fcf45a] text-lg font-body-bold">Recipe Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Start Session Button */}
                  <Button
                    onClick={startCookingSession}
                    className="w-full bg-[#fcf45a] text-[#1d7b86] hover:bg-[#fcf45a]/90 font-body-semibold"
                  >
                    🍳 Start Recipe Session
                  </Button>

                  {/* Save/Keep Buttons */}
                  <div className="flex gap-2">
                    {saveStatus === 'none' && (
                      <>
                        <Button
                          onClick={() => saveRecipe(generation)}
                          disabled={isSaving}
                          className="flex-1 bg-white text-[#1d7b86] hover:bg-gray-100 font-body-semibold"
                        >
                          {isSaving ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1d7b86]"></div>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              📖 Save Recipe
                            </span>
                          )}
                        </Button>
                        <Button
                          onClick={() => alert('This recipe will be kept in your current session but not saved to your collection. You can always save it later.')}
                          variant="outline"
                          className="flex-1 border-[#fcf45a] text-[#fcf45a] hover:bg-[#fcf45a]/20"
                        >
                          ✓ Keep for Now
                        </Button>
                      </>
                    )}

                    {saveStatus === 'saved' && (
                      <div className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-600 font-body-semibold">Recipe Saved!</span>
                      </div>
                    )}

                    {saveStatus === 'error' && (
                      <Button
                        onClick={() => saveRecipe(generation)}
                        className="flex-1 bg-red-500 text-white hover:bg-red-600 font-body-semibold"
                      >
                        🔄 Retry Save
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recipe Details */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                delay: 0.25
              }}
            >
              <RecipeDetail recipe={generation} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
