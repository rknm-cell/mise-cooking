import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

interface ChatRequest {
  messages: ChatCompletionMessageParam[];
}

export async function POST(req: Request) {
  const { messages } = (await req.json()) as ChatRequest;

  // Create a streaming response
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a professional chef and recipe assistant. When providing recipes, always follow this list and generate it in json format:

                1. Name
                2. Time (prep + cooking)
                3. Servings
                4. Ingredients (with precise measurements)
                  - List all ingredients with their quantities
                  - Include any optional ingredients or substitutions
                5. Instructions
                  - Number each step
                  - Include specific temperatures, times, and techniques
                  - Add helpful tips or notes where relevant
                6. Storage (if applicable) as storage
                7. Nutrition
                Keep your responses clear, precise, and easy to follow. Include helpful cooking tips and explain any technical terms. If asked about a specific cuisine or dietary requirement, adapt the recipe accordingly.
                
                `,
      } as ChatCompletionMessageParam,
      ...messages,
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  });

  // Create a TransformStream to handle the streaming response
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content ?? "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  // Return the stream as a response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
