import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { currentStep, currentStepDescription, userExperienceLevel = "intermediate" } = await req.json();

    if (!currentStepDescription) {
      return new Response(JSON.stringify({ error: 'Current step description is required' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a helpful cooking assistant. Based on the current cooking step, provide 3-4 helpful suggestions or tips that would be relevant to someone at this point in the recipe. Keep suggestions short, actionable, and appropriate for the user's experience level.

Current step: ${currentStepDescription}
User experience level: ${userExperienceLevel}

Provide suggestions in a simple array format, one per line.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: "Generate helpful cooking suggestions for this step:",
      maxTokens: 200,
      temperature: 0.4,
    });

    const suggestions = result.text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestions' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 