import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import { getModel } from "./model.mjs";

const servers = new Map();
const html = await readFile(new URL("./viewer.html", import.meta.url), "utf8");

async function startServer() {
  const server = createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-ancestors *");
    if (req.method !== "GET") {
      res.writeHead(405, { Allow: "GET" });
      res.end("Read-only canvas");
      return;
    }
    if (req.url === "/") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
    } else if (req.url === "/model") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      try {
        res.end(JSON.stringify(await getModel()));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, url: `http://127.0.0.1:${server.address().port}/` };
}

await joinSession({
  canvases: [
    createCanvas({
      id: "support-workflow-viewer",
      displayName: "Support workflow",
      description: "Visualize the support workflow and inspect its configured and available parameters.",
      inputSchema: {
        type: "object",
        properties: { workflow: { type: "string", const: "user-support-operator" } },
        additionalProperties: false,
      },
      actions: [
        {
          name: "get_model",
          description: "Read workflow metadata, graph, schemas, agent definitions, and parameter reference.",
          handler: () => getModel(),
        },
      ],
      open: async (ctx) => {
        let entry = servers.get(ctx.instanceId);
        if (!entry) {
          entry = await startServer();
          servers.set(ctx.instanceId, entry);
        }
        return { title: "Support workflow", url: entry.url };
      },
      onClose: async (ctx) => {
        const entry = servers.get(ctx.instanceId);
        if (entry) {
          servers.delete(ctx.instanceId);
          await new Promise((resolve, reject) => entry.server.close((error) => error ? reject(error) : resolve()));
        }
      },
    }),
  ],
});
