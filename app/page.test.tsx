import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

const sendMessageMock = vi.fn();
const regenerateMock = vi.fn();

let mockChatState = {
  messages: [] as any[],
  status: "ready",
  error: undefined as Error | undefined,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockChatState.messages,
    sendMessage: sendMessageMock,
    status: mockChatState.status,
    error: mockChatState.error,
    regenerate: regenerateMock,
  }),
}));

describe("LeadScore AI", () => {
  it("shows the initial empty state", () => {
    render(<Home />);

    expect(screen.getByText("Ready to score a lead?")).toBeInTheDocument();

    expect(
      screen.getByText(
        /Tell me about a company, its budget, timeline, and level of interest/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Try an example" })
    ).toBeInTheDocument();
  });

  it("fills the input when Try an example is clicked", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const input = screen.getByRole("textbox", {
      name: "Lead description",
    });

    await user.click(
      screen.getByRole("button", { name: "Try an example" })
    );

    expect(input).toHaveValue(
      "Acme Corp has a $50,000 budget, wants to start next month, and is very interested."
    );
  });

  it("keeps the Send button disabled when the input is empty", () => {
    render(<Home />);

    expect(
      screen.getByRole("button", { name: "Send" })
    ).toBeDisabled();
  });

  it("sends the lead description when the form is submitted", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const input = screen.getByRole("textbox", {
      name: "Lead description",
    });

    await user.type(
      input,
      "Acme Corp has a $50,000 budget and is very interested."
    );

    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(sendMessageMock).toHaveBeenCalledWith({
      text: "Acme Corp has a $50,000 budget and is very interested.",
    });

    expect(input).toHaveValue("");
  });

  it("shows the loading state while AI is processing", () => {
    mockChatState = {
      messages: [],
      status: "streaming",
      error: undefined,
    };

    render(<Home />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();

    mockChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };
  });

  it("disables the input while AI is processing", () => {
    mockChatState = {
      messages: [],
      status: "submitted",
      error: undefined,
    };

    render(<Home />);

    expect(
      screen.getByRole("textbox", { name: "Lead description" })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Thinking..." })
    ).toBeDisabled();

    mockChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };
  });

  it("shows lead information received", () => {
    mockChatState = {
      status: "ready",
      error: undefined,
      messages: [
        {
          id: "1",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              state: "input-available",
              input: {
                company: "Acme Corp",
                budget: 50000,
                timeline: "next month",
                interest: "high",
              },
            },
          ],
        },
      ],
    };

    render(<Home />);

    expect(
      screen.getByText("Lead information received")
    ).toBeInTheDocument();

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("next month")).toBeInTheDocument();
  });

  it("shows the lead score result", () => {
    mockChatState = {
      status: "ready",
      error: undefined,
      messages: [
        {
          id: "2",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              state: "output-available",
              output: {
                company: "Acme Corp",
                score: 100,
                priority: "High",
                budget: 50000,
                timeline: "next month",
                interest: "high",
                recommendation: "Follow up immediately.",
              },
            },
          ],
        },
      ],
    };

    render(<Home />);

    expect(screen.getByText("Lead Score")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("High Priority")).toBeInTheDocument();
    expect(
      screen.getByText("Follow up immediately.")
    ).toBeInTheDocument();
  });

  it("shows the tool error state", () => {
    mockChatState = {
      status: "ready",
      error: undefined,
      messages: [
        {
          id: "3",
          role: "assistant",
          parts: [
            {
              type: "tool-scoreLead",
              state: "output-error",
              errorText: "Unable to calculate score",
            },
          ],
        },
      ],
    };

    render(<Home />);

    expect(
      screen.getByText("Lead scoring failed")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unable to calculate score")
    ).toBeInTheDocument();
  });

  it("shows the chat error and retry button", () => {
    mockChatState = {
      messages: [],
      status: "ready",
      error: new Error("Connection failed"),
    };

    render(<Home />);

    expect(
      screen.getByText("Couldn't finish the response")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("alert")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Retry" })
    ).toBeInTheDocument();

    mockChatState = {
      messages: [],
      status: "ready",
      error: undefined,
    };
  });
});