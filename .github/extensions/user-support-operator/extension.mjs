import { defineWorkflow, joinSession } from "@github/copilot-sdk/extension";
import { workflowMeta, translationSchema, sentimentSchema, responderAgents } from "./config.mjs";

const workflow = defineWorkflow({
    meta: workflowMeta,
    run: (
async (ctx) => {
  const message = typeof ctx.args?.message === "string" ? ctx.args.message.trim() : "";
  if (!message) throw new Error("args.message (non-empty string) is required");

  // Each custom agent runs as its own subagent (isolated context); retry once on a null result.
  const callWithFallback = async (name, prompt, opts) => {
    const primary = await ctx.agent(prompt, { ...opts, label: name, agent: name });
    if (primary !== null) return primary;
    ctx.log(`'${name}' agent returned no result; retrying`);
    return ctx.agent(prompt, { ...opts, label: `${name}:retry`, agent: name });
  };

  ctx.phase("Translate");
  const translation = await callWithFallback(
    "translator",
    [
      "Return structured fields only; do not hand off.",
      "",
      "```yaml",
      `message: ${JSON.stringify(message)}`,
      "```",
    ].join("\n"),
    {
      schema: translationSchema,
    }
  );
  const t = translation ?? { translatedMessage: message, originalLanguage: "unknown", originalMessage: message };
  t.originalMessage = message;
  if (!translation) ctx.log("Translation failed; continuing with original text");
  ctx.log(`Detected language: ${t.originalLanguage}`);

  ctx.phase("Sentiment");
  const analysis = await callWithFallback(
    "sentiment",
    [
      "Return the classification only; do not hand off.",
      "",
      "```yaml",
      `translatedMessage: ${JSON.stringify(t.translatedMessage)}`,
      `originalLanguage: ${JSON.stringify(t.originalLanguage)}`,
      `originalMessage: ${JSON.stringify(t.originalMessage)}`,
      "```",
    ].join("\n"),
    {
      schema: sentimentSchema,
    }
  );
  const sentiment = analysis?.sentiment ?? "Neutral";
  const explanation = analysis?.explanation ?? "Sentiment analysis unavailable; defaulted to Neutral.";
  if (!analysis) ctx.log("Sentiment analysis failed; defaulting to Neutral");
  ctx.log(`Sentiment: ${sentiment}`);

  ctx.phase("Respond");
  const responder = responderAgents[sentiment];
  const response = await callWithFallback(
    responder,
    [
      "```yaml",
      `sentiment: ${sentiment}`,
      `explanation: ${JSON.stringify(explanation)}`,
      `originalMessage: ${JSON.stringify(t.originalMessage)}`,
      `originalLanguage: ${JSON.stringify(t.originalLanguage)}`,
      "```",
      "",
      "Return only the final user-facing response text.",
    ].join("\n"),
    {}
  );
  if (response === null) ctx.log(`Responder '${responder}' failed`);

  return {
    response: response ?? null,
    sentiment,
    explanation,
    responder,
    originalLanguage: t.originalLanguage,
    translatedMessage: t.translatedMessage,
    degraded: !translation || !analysis,
  };
}
),
});

await joinSession({ workflows: [workflow] });
