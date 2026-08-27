import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";
import { scoreLeadTool } from "@/lib/lead-tool";

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({
          error: `Too many messages. Maximum allowed is ${MAX_MESSAGES}.`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    for (const message of messages) {
      const text = JSON.stringify(message);

      if (text.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({
            error: `Message is too long. Maximum allowed is ${MAX_MESSAGE_LENGTH} characters.`,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

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