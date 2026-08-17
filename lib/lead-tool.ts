import { z } from "zod";

export const scoreLeadTool = {
  description:
    "Score a sales lead from 0 to 100 based on budget, timeline, and interest.",

  inputSchema: z.object({
    company: z.string().describe("Name of the company"),
    budget: z.number().describe("Estimated budget in US dollars"),
    timeline: z
      .string()
      .describe("When the company wants to start the project"),
    interest: z
      .enum(["low", "medium", "high"])
      .describe("How interested the company is"),
  }),

  execute: async ({
    company,
    budget,
    timeline,
    interest,
  }: {
    company: string;
    budget: number;
    timeline: string;
    interest: "low" | "medium" | "high";
  }) => {
    let score = 0;

    if (budget >= 50000) {
      score += 40;
    } else if (budget >= 20000) {
      score += 25;
    } else {
      score += 10;
    }

    if (interest === "high") {
      score += 30;
    } else if (interest === "medium") {
      score += 20;
    } else {
      score += 10;
    }

    const urgentTimeline =
      timeline.toLowerCase().includes("now") ||
      timeline.toLowerCase().includes("month");

    if (urgentTimeline) {
      score += 30;
    } else {
      score += 15;
    }

    const priority =
      score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";

    return {
      company,
      score,
      priority,
      budget,
      timeline,
      interest,
      recommendation:
        priority === "High"
          ? "Contact this lead as soon as possible."
          : priority === "Medium"
            ? "Follow up with this lead soon."
            : "Keep this lead in the nurture list.",
    };
  },
};