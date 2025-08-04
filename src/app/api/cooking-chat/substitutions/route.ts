import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { ingredient, recipeContext } = await req.json();

    if (!ingredient) {
      return new Response(JSON.stringify({ error: 'Ingredient is required' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a cooking expert. Provide 3-4 suitable substitutes for the given ingredient, considering the recipe context. For each substitute, include:
1. The substitute ingredient
2. How much to use (ratio or measurement)
3. Any adjustments needed in cooking method

Format your response as a simple list with clear measurements.`;

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: `Ingredient: ${ingredient}\nRecipe context: ${recipeContext || 'General cooking'}`,
      maxTokens: 250,
      temperature: 0.3,
    });

    const substitutions = result.text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return new Response(JSON.stringify({ substitutions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error generating substitutions:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate substitutions' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 