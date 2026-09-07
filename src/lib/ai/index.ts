import { AnthropicProvider } from "./anthropic-provider";
import type { AIProvider } from "./types";

export type { AIProvider, TaskSummary } from "./types";

/**
 * Returns a configured AI provider, or null if none is configured.
 * This is the single place that decides which provider to use, so adding a
 * new provider later only means adding a branch here.
 */
export function getAIProvider(): AIProvider | null {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
  }

  return null;
}
