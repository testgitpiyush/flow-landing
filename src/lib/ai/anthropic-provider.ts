import type { AIProvider, TaskSummary } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
// A small, inexpensive model is sufficient for a one-paragraph
// recommendation and keeps latency low on the dashboard. Overridable via
// env var in case the deployer wants a different model.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

function buildPrompt(tasks: TaskSummary[]): string {
  const today = tasks.filter((t) => t.timeframe === "today");
  const upcoming = tasks.filter((t) => t.timeframe === "upcoming");
  const pending = today.filter((t) => !t.completed);

  const lines = [
    "You are a focused productivity assistant inside a task dashboard.",
    "Given the user's current tasks, write ONE short, specific, actionable",
    "recommendation (max 2 sentences, no preamble, no markdown) about what",
    "they should focus on next. Be concrete - reference task titles when useful.",
    "",
    `Pending tasks today (${pending.length}):`,
    ...pending.map(
      (t) => `- [${t.priority}] ${t.title} (${t.duration}, ${t.category})`
    ),
    `Upcoming tasks (${upcoming.length}):`,
    ...upcoming.map((t) => `- [${t.priority}] ${t.title} (${t.duration})`),
  ];

  if (pending.length === 0 && upcoming.length === 0) {
    lines.push(
      "",
      "There are no tasks yet. Suggest they add their first task to get started."
    );
  }

  return lines.join("\n");
}

/**
 * Calls the Anthropic Messages API server-side. The API key never reaches
 * the client - this module is only ever imported from route handlers.
 */
export class AnthropicProvider implements AIProvider {
  constructor(private readonly apiKey: string) {}

  async getRecommendation(tasks: TaskSummary[]): Promise<string | null> {
    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 150,
          messages: [{ role: "user", content: buildPrompt(tasks) }],
        }),
      });

      if (!response.ok) {
        console.error(
          "Anthropic API error",
          response.status,
          await response.text().catch(() => "")
        );
        return null;
      }

      const data = await response.json();
      const text = data?.content
        ?.filter((block: { type: string }) => block.type === "text")
        ?.map((block: { text: string }) => block.text)
        ?.join(" ")
        ?.trim();

      return text || null;
    } catch (error) {
      console.error("Failed to get AI recommendation", error);
      return null;
    }
  }
}
