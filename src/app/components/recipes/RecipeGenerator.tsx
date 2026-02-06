"use client";

import { useEffect, useState } from "react";
import RecipeDetail from "~/app/components/recipes/RecipeDetail";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { recipe, type RecipeSchema } from "~/server/db/schema";

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

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
  const totalDuration = 10000;
  const updateInterval = 100;

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput(''); // Clear input immediately
    
    try {
      setGeneration(undefined);
      setIsLoading(true);
      setProgress(0);
      setSaveStatus('none');
      
      // Build the conversation context
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

      const recipeData: RecipeSchema = await response.json();
      setGeneration(recipeData);
      
      // Update conversation history
      const assistantMessage = `Generated recipe: ${recipeData.name} - ${recipeData.description}`;
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage }
      ]);
      
      console.log("recipedata: ", recipeData);
      setIsLoading(false);
    } catch (error) {
      const e = error as Error;
      console.error("Error generating recipe:", e);
      setIsLoading(false);
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
      <div className="flex h-[100px] w-full max-w-2xl flex-col rounded-xl bg-[#428a93] p-4 texture-paper shadow-ocean-lg">
        <div className="mb-4 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder={conversationHistory.length > 0 
                ? "Ask a follow-up question or request modifications..." 
                : "What do you want to make?"
              }
              className="flex-1 rounded-lg bg-zinc-500 px-4 py-2 text-white focus:outline-none focus:ring-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-[#fcf45a]/70 px-4 py-2 font-semibold text-black hover:bg-[#fcf45a] disabled:opacity-50"
            >
              Send
            </Button>
          </form>
        </div>
        {isLoading && !generation ? (
          <Progress value={progress} className="w-full" />
        ) : (
          <> </>
        )}
      </div>

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

      {generation && (
        <div className="w-full max-w-2xl mx-auto mt-4">
          {/* Recipe Actions */}
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

          {/* Recipe Details */}
          <RecipeDetail recipe={generation} />
        </div>
      )}
    </>
  );
}
