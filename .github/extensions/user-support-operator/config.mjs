export const workflowMeta = {
  name: "user-support-operator",
  description: "End-to-end support flow: translate → sentiment → routed response (acknowledgment / supporter / information) using the repo's custom agents. args: { message: string } — the user's message in any language. Returns { response, sentiment, originalLanguage }.",
  phases: [
    { title: "Translate", detail: "translator agent → English + original language" },
    { title: "Sentiment", detail: "sentiment agent → Positive/Negative/Neutral" },
    { title: "Respond", detail: "acknowledgment / supporter / information agent" },
  ],
  argsSchema: {
    type: "object",
    required: ["message"],
    properties: { message: { type: "string" } },
  },
};

export const translationSchema = {
  type: "object",
  required: ["translatedMessage", "originalLanguage", "originalMessage"],
  properties: {
    translatedMessage: { type: "string" },
    originalLanguage: { type: "string" },
    originalMessage: { type: "string" },
  },
};

export const sentimentSchema = {
  type: "object",
  required: ["sentiment", "explanation"],
  properties: {
    sentiment: { type: "string", enum: ["Positive", "Negative", "Neutral"] },
    explanation: { type: "string" },
  },
};

export const responderAgents = {
  Positive: "acknowledgment",
  Negative: "supporter",
  Neutral: "information",
};
