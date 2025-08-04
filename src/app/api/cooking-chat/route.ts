import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";

// Content moderation helper
async function validateRecipeRequest(message: string): Promise<{ 
  isValid: boolean; 
  reason?: string;
}> {
  try {
    const moderationPrompt = `
      Analyze if this request is appropriate for a cooking assistant and food-related.
      Rules:
      1. Must be about food, cooking, recipes, or kitchen activities
      2. Must not contain inappropriate, offensive, or harmful content
      3. Must not request non-food items or dangerous substances
      4. Must be safe and legal cooking-related content
      
      Request: "${message}"
      
      Respond with a JSON object containing:
      {
        "isValid": boolean,
        "reason": string (only if isValid is false)
      }
    `;

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        isValid: z.boolean(),
        reason: z.string().optional()
      }),
      system: "You are a content moderation system for a cooking assistant.",
      prompt: moderationPrompt,
      maxTokens: 200,
      temperature: 0.1
    });

    return result.object;
  } catch (error) {
    console.error('Error in content moderation:', error);
    // Default to allowing the request if moderation fails
    return { isValid: true };
  }
}

// --- Tool Function Schemas for AI ---
const setTimerSchema = z.object({
  duration: z.number().describe("Duration of the timer in seconds"),
  description: z.string().describe("What the timer is for"),
});

const moveToStepSchema = z.object({
  action: z.enum(["next", "previous", "specific"]).describe("Navigation action"),
  stepNumber: z.number().optional().describe("Specific step number (only for 'specific' action)"),
  reason: z.string().describe("Why this navigation is happening"),
});

const modifyRecipeSchema = z.object({
  modificationType: z.enum(["ingredient", "time", "temperature", "technique", "quantity"]).describe("Type of modification"),
  target: z.string().describe("What is being modified (ingredient name, step number, etc.)"),
  newValue: z.string().describe("The new value or instruction"),
  reason: z.string().describe("Why this modification is needed"),
});

const getPrepWorkSchema = z.object({
  prepType: z.enum(["ingredients", "equipment", "timing", "techniques"]).describe("Type of prep work needed"),
  focus: z.string().describe("Specific focus area for prep work"),
});

const getTimingSuggestionsSchema = z.object({
  timingType: z.enum(["step", "overall", "parallel", "resting"]).describe("Type of timing guidance needed"),
  context: z.string().describe("Current cooking context"),
});

// --- Chat Request/Response Schemas ---
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipeId: z.string().optional(),
  recipeName: z.string().optional(),
  recipeDescription: z.string().optional(),
  currentStep: z.number().optional(),
  totalSteps: z.number().optional(),
  currentStepDescription: z.string().optional(),
  completedSteps: z.array(z.number()).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
  // Voice-specific fields
  isVoiceCommand: z.boolean().optional(),
  wakePhrase: z.string().optional(),
});

// --- Main Chat Endpoint with Comprehensive Tool Calling ---
export async function POST(req: Request) {
  try {
    // Validate request
    const body = await req.json();
    const validatedData = chatRequestSchema.parse(body);
    const {
      message,
      recipeId,
      recipeName,
      recipeDescription,
      currentStep,
      totalSteps,
      currentStepDescription,
      completedSteps = [],
      conversationHistory = [],
      isVoiceCommand = false,
      wakePhrase
    } = validatedData;

    // Content moderation check
    const moderationResult = await validateRecipeRequest(message);
    if (!moderationResult.isValid) {
      return new Response(JSON.stringify({
        response: `I apologize, but I can only assist with cooking-related requests. ${moderationResult.reason} Please feel free to ask me about recipes, cooking techniques, or kitchen help!`,
        suggestions: [
          "Ask for a specific recipe",
          "Get cooking tips",
          "Learn about ingredients",
          "Get kitchen safety advice"
        ]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Enhanced system prompt with all tool descriptions
    const systemPrompt = `You are Mise, an intelligent cooking assistant with voice-first capabilities. You can perform the following actions:

1. TIMER MANAGEMENT: If the user asks for a timer, call the setTimer function with duration in seconds and description. Understand time expressions like '5 minutes', 'an hour', 'hour and a half', 'half an hour', '90 minutes', '2 hours', '1.5 hours', etc.

2. STEP NAVIGATION: If the user wants to move to the next step, previous step, or a specific step, call the moveToStep function. This includes commands like "next step", "go back", "move to step 3", etc.

3. RECIPE MODIFICATION: If the user wants to modify the recipe (ingredients, times, temperatures, techniques), call the modifyRecipe function. This includes substitutions, time adjustments, temperature changes, etc.

4. PREP WORK GUIDANCE: If the user asks about preparation work, call the getPrepWork function. This includes ingredient prep, equipment setup, timing prep, technique prep, etc.

5. TIMING SUGGESTIONS: If the user asks about timing or scheduling, call the getTimingSuggestions function. This includes step timing, overall timing, parallel cooking, resting times, etc.

For voice commands, respond with a brief acknowledgment before executing the action. Be concise but helpful.`;

    // Conversation context
    const conversationContext = buildConversationContext(conversationHistory, message);

    // Determine which tool to call based on the message content
    const messageLower = message.toLowerCase();
    
    // Timer detection
    if (messageLower.includes('timer') || messageLower.includes('set timer') || 
        messageLower.includes('cook for') || messageLower.includes('boil for') || 
        messageLower.includes('simmer for') || messageLower.includes('bake for') ||
        /\d+\s*(minute|hour|second)/.test(messageLower)) {
      
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: setTimerSchema,
        system: systemPrompt,
        prompt: conversationContext,
        maxTokens: 200,
        temperature: 0.2,
      });

      if (result.object && result.object.duration && result.object.description) {
        const timerResponse = await createTimer({
          duration: result.object.duration,
          description: result.object.description,
          stage: `Step ${currentStep || 1}`,
          recipeId,
          stepNumber: currentStep,
        });

        const response = isVoiceCommand 
          ? `I've started a timer for ${result.object.description} (${Math.floor(result.object.duration / 60)}:${(result.object.duration % 60).toString().padStart(2, '0')}).`
          : `I've started a timer for ${result.object.description} (${Math.floor(result.object.duration / 60)}:${(result.object.duration % 60).toString().padStart(2, '0')}). The timer is now running in your cooking session.`;

        return new Response(JSON.stringify({
          response,
          timerAction: {
            action: "create",
            duration: result.object.duration,
            description: result.object.description,
            stage: `Step ${currentStep || 1}`,
          },
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Step navigation detection
    if (messageLower.includes('next step') || messageLower.includes('move to next') ||
        messageLower.includes('previous step') || messageLower.includes('go back') ||
        messageLower.includes('step') && /\d+/.test(messageLower)) {
      
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: moveToStepSchema,
        system: systemPrompt,
        prompt: conversationContext,
        maxTokens: 200,
        temperature: 0.2,
      });

      if (result.object) {
        const response = isVoiceCommand 
          ? `${result.object.reason}`
          : result.object.reason;

        return new Response(JSON.stringify({
          response,
          navigationAction: {
            action: result.object.action,
            stepNumber: result.object.stepNumber,
            reason: result.object.reason,
          },
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Recipe modification detection
    if (messageLower.includes('substitute') || messageLower.includes('replace') ||
        messageLower.includes('change') || messageLower.includes('modify') ||
        messageLower.includes('instead of') || messageLower.includes('alternative')) {
      
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: modifyRecipeSchema,
        system: systemPrompt,
        prompt: conversationContext,
        maxTokens: 300,
        temperature: 0.3,
      });

      if (result.object) {
        const response = isVoiceCommand 
          ? `${result.object.reason}`
          : result.object.reason;

        return new Response(JSON.stringify({
          response,
          modificationAction: {
            type: result.object.modificationType,
            target: result.object.target,
            newValue: result.object.newValue,
            reason: result.object.reason,
          },
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Prep work detection
    if (messageLower.includes('prep') || messageLower.includes('prepare') ||
        messageLower.includes('setup') || messageLower.includes('get ready') ||
        messageLower.includes('what do i need')) {
      
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: getPrepWorkSchema,
        system: systemPrompt,
        prompt: conversationContext,
        maxTokens: 200,
        temperature: 0.3,
      });

      if (result.object) {
        // Generate prep work suggestions
        const prepSuggestions = await generatePrepWorkSuggestions(
          result.object.prepType,
          result.object.focus,
          currentStepDescription,
          recipeName
        );

        const response = isVoiceCommand 
          ? `Here's what you need to prepare: ${prepSuggestions.join(', ')}`
          : `Here's what you need to prepare: ${prepSuggestions.join(', ')}`;

        return new Response(JSON.stringify({
          response,
          prepWorkAction: {
            type: result.object.prepType,
            focus: result.object.focus,
            suggestions: prepSuggestions,
          },
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Timing suggestions detection
    if (messageLower.includes('how long') || messageLower.includes('timing') ||
        messageLower.includes('when') || messageLower.includes('schedule') ||
        messageLower.includes('time management')) {
      
      const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: getTimingSuggestionsSchema,
        system: systemPrompt,
        prompt: conversationContext,
        maxTokens: 200,
        temperature: 0.3,
      });

      if (result.object) {
        // Generate timing suggestions
        const timingSuggestions = await generateTimingSuggestions(
          result.object.timingType,
          result.object.context,
          currentStep,
          totalSteps
        );

        const response = isVoiceCommand 
          ? `Here's the timing: ${timingSuggestions.join(', ')}`
          : `Here's the timing guidance: ${timingSuggestions.join(', ')}`;

        return new Response(JSON.stringify({
          response,
          timingAction: {
            type: result.object.timingType,
            context: result.object.context,
            suggestions: timingSuggestions,
          },
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Fallback to regular AI response
    const fallback = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: conversationContext,
      maxTokens: 300,
      temperature: 0.3,
    });

    const response = isVoiceCommand 
      ? `${fallback.text.trim()}`
      : fallback.text.trim();

    return new Response(JSON.stringify({
      response,
      suggestions: [],
      quickActions: ["What's next?","How long?","Substitute?","Help!","Technique"],
      context: "cooking_assistance"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in cooking chat:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Helper function to create timer via API
async function createTimer(timerData: {
  duration: number;
  description: string;
  stage: string;
  recipeId?: string;
  stepNumber?: number;
}) {
  try {
    // For now, we'll just return a mock response
    // In a real implementation, you'd call your timer service
    console.log('Creating timer:', timerData);
    return { success: true, timerId: 'mock-timer-id' };
  } catch (error) {
    console.error('Error creating timer:', error);
    throw error;
  }
}

// Helper function to build conversation context
function buildConversationContext(history: Array<{role?: string, content?: string}>, currentMessage: string) {
  if (history.length === 0) {
    return currentMessage;
  }

  // Keep last 5 exchanges for context
  const recentHistory = history.slice(-10);
  const context = recentHistory
    .map(msg => `${msg.role || 'user'}: ${msg.content || ''}`)
    .join('\n');

  return `${context}\n\nUser: ${currentMessage}`;
}

// Helper function to generate prep work suggestions
async function generatePrepWorkSuggestions(
  prepType: string,
  focus: string,
  currentStepDescription?: string,
  recipeName?: string
): Promise<string[]> {
  try {
    const systemPrompt = `You are a cooking expert. Based on the prep type and focus, provide 3-4 specific, actionable prep work suggestions. Keep them concise and practical.

Prep type: ${prepType}
Focus: ${focus}
Current step: ${currentStepDescription || 'Not specified'}
Recipe: ${recipeName || 'Not specified'}

Provide suggestions as a simple list, one per line.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: "Generate prep work suggestions:",
      maxTokens: 200,
      temperature: 0.3,
    });

    return result.text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error generating prep work suggestions:', error);
    return ['Gather all ingredients', 'Prepare cooking equipment', 'Read through the recipe'];
  }
}

// Helper function to generate timing suggestions
async function generateTimingSuggestions(
  timingType: string,
  context: string,
  currentStep?: number,
  totalSteps?: number
): Promise<string[]> {
  try {
    const systemPrompt = `You are a cooking expert. Based on the timing type and context, provide 3-4 specific timing suggestions. Keep them concise and practical.

Timing type: ${timingType}
Context: ${context}
Current step: ${currentStep || 'Not specified'}
Total steps: ${totalSteps || 'Not specified'}

Provide suggestions as a simple list, one per line.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: "Generate timing suggestions:",
      maxTokens: 200,
      temperature: 0.3,
    });

    return result.text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error generating timing suggestions:', error);
    return ['Start prep work early', 'Monitor cooking times closely', 'Allow for resting periods'];
  }
} 