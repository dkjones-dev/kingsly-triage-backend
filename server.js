// server.js
// A minimal backend that holds your Anthropic API key securely and
// forwards triage/report requests to Claude on behalf of the frontend.
// The frontend NEVER sees or holds the API key — that's the whole point.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());              // allows your frontend (a different origin) to call this server
app.use(express.json());      // lets the server read JSON request bodies

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // read from a .env file, never hardcoded, never sent to the browser
});

// One shared endpoint: the frontend sends a prompt, the backend asks Claude,
// and returns the plain text response. This mirrors exactly what the
// artifact's callClaude() function did, just moved server-side.
app.post("/api/claude", async (req, res) => {
  try {
    const { prompt, max_tokens } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'prompt' in request body." });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: max_tokens || 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.map((block) => block.text || "").join("\n");
    res.json({ text });
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "The agent had trouble reaching Claude. Please try again." });
  }
});

// Simple health check — useful for confirming the server is alive after deployment
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kingsly triage backend running on http://localhost:${PORT}`);
});
