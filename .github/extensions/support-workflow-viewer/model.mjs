import { readFile } from "node:fs/promises";
import { workflowMeta, translationSchema, sentimentSchema, responderAgents } from "../user-support-operator/config.mjs";

const limits = [
  ["maxConcurrentSubagents", "Positive number", "Concurrent subagent ceiling; if omitted, falls back to maxTotalSubagents when set."],
  ["maxTotalSubagents", "Positive number", "Cumulative subagent ceiling, including retries."],
  ["maxAiCredits", "Positive number", "Soft, post-paid AI credit ceiling across subagents and descendants."],
  ["timeoutSeconds", "Positive number (up to 2147483.647)", "Accumulated active execution time; paused time is excluded."],
];

export async function getModel() {
  const nodes = [
    { id: "translator", phase: "Translate", purpose: "Translate to English and detect the original language.", schema: translationSchema },
    { id: "sentiment", phase: "Sentiment", purpose: "Classify Positive, Negative, or Neutral.", schema: sentimentSchema },
    ...Object.entries(responderAgents).map(([sentiment, id]) => ({
      id, phase: "Respond", sentiment,
      purpose: { Positive: "Thank the user warmly.", Negative: "Comfort the user empathetically.", Neutral: "Provide a factual, neutral reply." }[sentiment],
      schema: null,
    })),
  ];
  const agents = await Promise.all(nodes.map(async (node) => ({
    ...node,
    file: `.github/agents/${node.id}.agent.md`,
    definition: await readFile(new URL(`../../agents/${node.id}.agent.md`, import.meta.url), "utf8"),
    options: { label: node.id, agent: node.id, ...(node.schema ? { schema: node.schema } : {}) },
  })));
  return {
    meta: workflowMeta,
    source: ".github/extensions/user-support-operator/extension.mjs",
    agents,
    edges: [
      { from: "message", to: "translator" },
      { from: "translator", to: "sentiment" },
      ...Object.entries(responderAgents).map(([label, to]) => ({ from: "sentiment", to, label })),
      ...Object.values(responderAgents).map((from) => ({ from, to: "response" })),
    ],
    parameters: [
      { name: "args.message", scope: "Workflow input", type: "string", configured: "Required; non-empty after trimming", description: "User message in any language. The workflow trims leading/trailing whitespace." },
      ...limits.map(([name, type, description]) => ({
        name, scope: "Resource limit", type,
        configured: workflowMeta.limits?.[name] ?? "Not declared",
        description: `${description} May be overridden per invocation; null removes the ceiling.`,
      })),
      { name: "agent", scope: "Subagent", type: "string", configured: "Named custom agent for each node", description: "Selects the custom agent. Omitted on the default-agent retry." },
      { name: "label", scope: "Subagent", type: "string", configured: "Agent name; <name>:fallback on retry", description: "Display and memoization label." },
      { name: "schema", scope: "Subagent", type: "object", configured: "Translation and sentiment schemas; no responder schema", description: "Requests structured output. See the selected node's schema." },
      { name: "model", scope: "Subagent", type: "string", configured: "No explicit ctx.agent override", description: "See raw agent frontmatter for model declarations. Effective model is resolved by the runtime; this viewer does not claim to resolve it. VS Code handoff model overrides are not used by this workflow." },
      { name: "reasoningEffort", scope: "Subagent", type: "string", configured: "Not explicitly set", description: "Optional runtime override; supported values depend on the selected model." },
      { name: "contextTier", scope: "Subagent", type: "default | long_context", configured: "Not explicitly set", description: "Optional runtime context-tier override." },
    ],
    behavior: [
      "Three sequential stages; exactly one responder branch is selected.",
      "A null custom-agent result retries once with the default agent. Hard runtime errors still abort the run.",
      "Translation failure after retry uses the original text and language unknown; sentiment failure defaults to Neutral. Both are logged and set degraded=true.",
      "Responder failure after retry returns response=null; it does not by itself set degraded=true.",
      "The runtime journals agent calls for resume. The viewer is read-only and never starts a run.",
    ],
    result: {
      response: "string | null",
      sentiment: "Positive | Negative | Neutral",
      explanation: "string",
      responder: Object.values(responderAgents).join(" | "),
      originalLanguage: "string",
      translatedMessage: "string",
      degraded: "boolean",
    },
  };
}
