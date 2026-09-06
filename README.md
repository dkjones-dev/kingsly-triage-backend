# Kingsly Call Triage Agent — Standalone Setup

This lets the triage agent run outside of claude.ai, using your own Anthropic API key, safely hidden on a server instead of exposed in the browser.

## 1. Get an API key
Sign up at console.anthropic.com and create a key.

## 2. Set up the backend
```bash
cd kingsly-backend
npm install
cp .env.example .env
```
Open `.env` and paste your real key in place of `your-real-api-key-goes-here`.

## 3. Run the backend
```bash
npm start
```
You should see: `Kingsly triage backend running on http://localhost:3000`

Leave this running in its own terminal window.

## 4. Open the frontend
Open `kingsly-agentic-triage-standalone.html` directly in your browser (double-click it, or drag it into a browser window). It's already set up to talk to `http://localhost:3000`.

Click "Run triage agent" — this time it's really calling *your* backend, which calls Claude using *your* key.

## 5. Deploy for real, on Render (free tier)

This part happens on Render's website, in your browser — not something I can do for you, since it needs your own account and billing details. Here's the exact path:

1. **Put this folder on GitHub.** If you don't have a GitHub account, create one at github.com (free). Create a new repository (e.g. "kingsly-triage-backend"), and upload everything in this `kingsly-backend` folder to it — `server.js`, `package.json`, `.gitignore`, `README.md`. **Do NOT upload your real `.env` file** — the `.gitignore` already prevents this if you're using git normally, but double-check before uploading if you're doing it by hand through GitHub's web uploader.

2. **Sign up at render.com** (free tier is enough for this).

3. Click **New → Web Service**, and connect your GitHub account, then select the repository you just created.

4. Render will ask for a few settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Scroll to **Environment Variables** and add one:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your real key (paste it here — this is the one safe place for it to live, since Render keeps it out of your code entirely)

6. Click **Create Web Service**. Render will build and deploy it — after a minute or two, you'll get a real URL, something like `https://kingsly-triage-backend.onrender.com`.

7. Test it's alive by visiting `https://your-url.onrender.com/health` in a browser — you should see `{"status":"ok"}`.

**One honest limitation of Render's free tier**: it "spins down" after 15 minutes of no traffic, so the first request after a quiet period can take 20-30 seconds to wake back up. Fine for a portfolio demo you're actively showing someone; worth mentioning if you ever needed instant response times in production.

## 6. Point the frontend at your live backend

Once you have your real Render URL, update the `BACKEND_URL` constant near the top of `kingsly-agentic-triage-standalone.html`'s script:
```javascript
const BACKEND_URL = "https://kingsly-triage-backend.onrender.com";
```

Then host that HTML file somewhere too — the easiest free option is **GitHub Pages**: put the HTML file in a GitHub repo, go to that repo's Settings → Pages, and GitHub will give you a live URL for the page itself, something like `https://yourusername.github.io/kingsly-triage-demo/`.

At that point, you'd have two real, live URLs — one for the backend, one for the frontend — and a link you could genuinely share with anyone, not just inside this chat.

## Cost note
Each triage run costs a small amount (a few cents) in Anthropic API usage, billed to whichever account owns the API key. Free trial credits typically cover plenty of testing.
