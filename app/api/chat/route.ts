import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { scoreLeadTool } from "@/lib/lead-tool";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),
      messages: await convertToModelMessages(messages),
      tools: {
        scoreLead: scoreLeadTool,
      },
    });

    return result.toUIMessageStreamResponse({
      onError: () => {
        return "Something went wrong while generating the response.";
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong while processing your request.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}