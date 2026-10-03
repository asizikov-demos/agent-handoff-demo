import test from "node:test";
import assert from "node:assert/strict";
import { getModel } from "./model.mjs";
import { workflowMeta, responderAgents, translationSchema, sentimentSchema } from "../user-support-operator/config.mjs";

test("viewer uses the workflow's metadata, schemas, and exact responder routing", async () => {
  const model = await getModel();
  assert.strictEqual(model.meta, workflowMeta);
  assert.strictEqual(model.agents[0].schema, translationSchema);
  assert.strictEqual(model.agents[1].schema, sentimentSchema);
  assert.deepEqual(
    model.edges.filter((edge) => edge.from === "sentiment"),
    Object.entries(responderAgents).map(([label, to]) => ({ from: "sentiment", to, label })),
  );
  assert.equal(model.agents.length, 5);
  for (const agent of model.agents) {
    assert.equal(agent.options.agent, agent.id);
    assert.equal(agent.options.label, agent.id);
    assert.match(agent.definition, /^---\n/);
    assert.equal(agent.options.model, undefined);
  }
});

test("parameter reference distinguishes input, unset limits, and available agent options", async () => {
  const model = await getModel();
  assert.deepEqual(model.meta.argsSchema.required, ["message"]);
  const limits = model.parameters.filter((parameter) => parameter.scope === "Resource limit");
  assert.equal(limits.length, 4);
  assert.ok(limits.every((parameter) => parameter.configured === "Not declared"));
  assert.deepEqual(
    model.parameters.filter((parameter) => parameter.scope === "Subagent").map((parameter) => parameter.name).sort(),
    ["agent", "contextTier", "label", "model", "reasoningEffort", "schema"].sort(),
  );
  assert.deepEqual(Object.keys(model.result).sort(), [
    "degraded", "explanation", "originalLanguage", "responder", "response", "sentiment", "translatedMessage",
  ]);
});
