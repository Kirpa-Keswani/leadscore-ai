"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

type LeadScore = {
  company: string;
  score: number;
  priority: string;
  budget: number;
  timeline: string;
  interest: string;
  recommendation: string;
};

function ToolStateCard({
  state,
  input,
}: {
  state: "input-streaming" | "input-available";
  input?: unknown;
}) {
  const lead = (input ?? {}) as Partial<LeadScore>;

  if (state === "input-streaming") {
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400" />

          <div>
            <p className="font-semibold text-yellow-300">
              Preparing lead score
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Collecting the information needed to score this lead...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
          ✓
        </div>

        <div>
          <p className="font-semibold text-blue-300">
            Lead information received
          </p>

          <p className="text-sm text-slate-400">
            Ready to calculate the lead score.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Company
          </p>
          <p className="mt-1 font-medium text-white">
            {lead.company || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Budget
          </p>
          <p className="mt-1 font-medium text-white">
            {typeof lead.budget === "number"
              ? `$${lead.budget.toLocaleString()}`
              : "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Timeline
          </p>
          <p className="mt-1 font-medium text-white">
            {lead.timeline || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Interest
          </p>
          <p className="mt-1 font-medium capitalize text-white">
            {lead.interest || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

function LeadScoreCard({ output }: { output: LeadScore }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Lead Score
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            {output.company}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold text-emerald-400">
            {output.score}
          </p>
          <p className="text-xs text-slate-400">out of 100</p>
        </div>
      </div>

      <div className="mb-5">
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">
          {output.priority} Priority
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Budget
          </p>
          <p className="mt-1 font-semibold text-white">
            ${output.budget.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Timeline
          </p>
          <p className="mt-1 font-semibold text-white">
            {output.timeline}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Interest
          </p>
          <p className="mt-1 font-semibold capitalize text-white">
            {output.interest}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-950/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-200">
          {output.recommendation}
        </p>
      </div>
    </div>
  );
}

function ToolErrorCard({ error }: { error?: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-300">
          !
        </div>

        <div>
          <p className="font-semibold text-red-300">
            Lead scoring failed
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            The lead could not be scored right now. Please check the lead
            information and try again.
          </p>

          {error && (
            <p className="mt-2 text-xs text-red-300/70">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">
            Week 5 • Assignment 1
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            LeadScore AI
          </h1>

          <p className="mt-2 text-slate-400">
            AI-powered lead scoring with a server-side tool.
          </p>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl p-4 ${
                message.role === "user"
                  ? "ml-auto max-w-[85%] bg-blue-600"
                  : "mr-auto max-w-[90%] bg-slate-800"
              }`}
            >
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-300">
                {message.role === "user" ? "You" : "AI"}
              </p>

              <div className="space-y-4">
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <p
                        key={index}
                        className="whitespace-pre-wrap leading-7"
                      >
                        {part.text}
                      </p>
                    );
                  }

                  if (part.type === "tool-scoreLead") {
                    if (part.state === "input-streaming") {
                      return (
                        <ToolStateCard
                          key={index}
                          state="input-streaming"
                          input={part.input}
                        />
                      );
                    }

                    if (part.state === "input-available") {
                      return (
                        <ToolStateCard
                          key={index}
                          state="input-available"
                          input={part.input}
                        />
                      );
                    }

                    if (part.state === "output-available") {
                      return (
                        <LeadScoreCard
                          key={index}
                          output={part.output as LeadScore}
                        />
                      );
                    }

                    if (part.state === "output-error") {
                      return (
                        <ToolErrorCard
                          key={index}
                          error={part.errorText}
                        />
                      );
                    }
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a lead..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={status !== "ready"}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "submitted" || status === "streaming"
              ? "Thinking..."
              : "Send"}
          </button>
        </form>
      </div>
    </main>
  );
}