# LeadScore AI

LeadScore AI is an AI-powered lead scoring application built with Next.js and the AI SDK.

The app uses a server-side `scoreLead` tool to analyze a sales lead based on its budget, timeline, and level of interest. The result is displayed as a structured lead score card instead of raw JSON.

## Who It's For

LeadScore AI is designed for sales teams, small businesses, and anyone who needs a quick way to prioritize potential customers.

It helps users turn a natural-language description of a lead into a simple score, priority level, and recommended follow-up action.

## Features

* AI-powered lead scoring
* Server-side AI SDK tool
* Zod schema for typed tool input
* Streaming tool states
* Structured lead score card
* Designed tool error state
* Responsive UI

## Tech Stack

* Next.js 16.3.1
* React 19.2.8
* TypeScript
* Tailwind CSS
* AI SDK
* Google AI SDK
* Zod

## Tool Contract

### Tool Name

`scoreLead`

### Purpose

Scores a sales lead from 0 to 100 based on budget, timeline, and interest.

### Input Schema

```text
company: string
budget: number
timeline: string
interest: "low" | "medium" | "high"
```

### Example Input

```json
{
  "company": "Acme Corp",
  "budget": 50000,
  "timeline": "next month",
  "interest": "high"
}
```

### Return Shape

```text
company: string
score: number
priority: string
budget: number
timeline: string
interest: string
recommendation: string
```

### Example Result

```json
{
  "company": "Acme Corp",
  "score": 100,
  "priority": "High",
  "budget": 50000,
  "timeline": "next month",
  "interest": "high",
  "recommendation": "Contact this lead as soon as possible."
}
```

## How Scoring Works

The scoring tool uses three factors.

### Budget

* $50,000 or more → 40 points
* $20,000–$49,999 → 25 points
* Below $20,000 → 10 points

### Interest

* High → 30 points
* Medium → 20 points
* Low → 10 points

### Timeline

A timeline containing "now" or "month" is treated as urgent.

* Urgent timeline → 30 points
* Other timeline → 15 points

### Priority

* 75–100 → High
* 50–74 → Medium
* Below 50 → Low

The maximum possible score is 100.

## Setup

### Requirements

You need:

* Node.js
* npm
* A Google AI API key

### 1. Clone the repository

```bash
git clone https://github.com/Kirpa-Keswani/leadscore-ai.git
cd leadscore-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env.local` file in the project root.

Add your Google AI API key:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

Keep this key private. Do not commit `.env.local` to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the local address shown in the terminal, normally:

```text
http://localhost:3000
```

## Usage

Enter a lead description in natural language.

For example:

> Acme Corp has a $50,000 budget, wants to start next month, and is very interested.

The AI processes the request and uses the server-side `scoreLead` tool.

The application then displays:

* Company
* Lead score
* Priority
* Budget
* Timeline
* Interest
* Recommendation

## Architecture

The application follows this flow:

```text
User
  ↓
Next.js / React UI
  ↓
Chat API Route
  ↓
Google AI Model
  ↓
scoreLead Server-Side Tool
  ↓
Score + Priority + Recommendation
  ↓
Structured Lead Score Card
  ↓
User
```

The main API route is:

```text
app/api/chat/route.ts
```

The lead scoring logic is kept in:

```text
lib/lead-tool.ts
```

Keeping the scoring logic in a separate server-side tool makes it easier to maintain and keeps it separate from the user interface.

## V2 Evaluation Results

I tested LeadScore AI with five different lead profiles to check how it handled different budgets, timelines, and interest levels.

| Test | Company       |  Budget | Timeline   | Interest |   Score | Priority | Result |
| ---- | ------------- | ------: | ---------- | -------- | ------: | -------- | ------ |
| 1    | Acme Corp     | $50,000 | Next month | High     | 100/100 | High     | Pass   |
| 2    | Small Startup | $10,000 | 6 months   | Low      |  50/100 | Medium   | Pass   |
| 3    | TechFlow      | $30,000 | 2 months   | High     |  85/100 | High     | Pass   |
| 4    | Demo Company  | $20,000 | 3 months   | Medium   |  75/100 | High     | Pass   |
| 5    | BudgetCo      |  $5,000 | 12 months  | Low      |  50/100 | Medium   | Pass   |

### Overall Result

**5 out of 5 tests passed — 100% pass rate.**

The evaluation included different budget levels, all three interest levels, and different timelines.

Screenshots of the individual evaluation runs were saved as supporting evidence.

## Limitations

The current version has several limitations:

1. The scoring system uses fixed rules rather than learning from historical sales data.
2. Timeline urgency is detected using simple text matching. Timelines containing "now" or "month" are treated as urgent.
3. The score is a prioritization guide and does not guarantee that a lead will become a customer.
4. The application does not currently connect to a real CRM or sales database.
5. The result depends on the AI correctly understanding the information provided by the user.

### Possible Improvements

A future version could:

* Connect to a CRM
* Use historical sales data
* Improve timeline understanding
* Add lead history and tracking
* Add authentication
* Provide analytics
* Allow feedback to improve the scoring system

## Design Decision

One important design decision was keeping the lead scoring logic inside a server-side tool instead of placing the scoring rules directly in the frontend.

I chose this approach because it keeps the scoring logic separate from the UI and prevents the client from directly controlling the scoring process. It also makes the scoring rules easier to maintain and change later.

## AI Transparency

I built LeadScore AI with AI assistance from Claude.

I used AI as a development partner for planning, implementation support, debugging, and documentation. I personally ran the application, tested the lead-scoring behavior, reviewed the code, and verified the evaluation results.

## Demo

A 3–5 minute live demonstration video accompanies this project as part of FlyRank Assignment 8.1.

The demo shows:

* The application running live
* A complete lead-scoring flow
* The AI processing the input
* The resulting score and recommendation
* One design decision
* One limitation

**Demo video:** [Add your video link here]

## Repository

GitHub repository:

https://github.com/Kirpa-Keswani/leadscore-ai
