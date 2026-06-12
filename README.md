# MCP Explained — for Business Users

An interactive, plain-English web app that explains the **Model Context Protocol (MCP)**
end-to-end — written for business audiences, not engineers.

## What it covers
1. **What MCP is** — the "USB-C for AI" idea, in three simple cards.
2. **Why it exists** — the M×N "tangle of wires" problem vs. the M+N standard hub (animated SVG diagrams).
3. **How it works** — the three roles: Host, Client, Server, plus what a Server offers (Tools, Resources, Prompts).
4. **In action** — a step-through walkthrough of a real request, including a human-in-the-loop approval.
5. **Use cases** — Support, Sales/CRM, Knowledge, Finance.
6. **Business value** — cost, speed, governance, no lock-in, accuracy, scale.
7. **Glossary / FAQ** — common business questions answered.

## Running it
It's a static site — no build step or dependencies.

```bash
# Option A: just open the file
open index.html

# Option B: serve locally
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploying (GitHub Pages)
Push to your repo and enable **Settings → Pages → Deploy from branch** (root).
The site is plain `index.html` + `styles.css` + `app.js`, so it works out of the box.

## Files
- `index.html` — content and structure
- `styles.css` — visual design (dark, responsive)
- `app.js` — scroll progress, reveal animations, the wiring diagrams, and the walkthrough

> Concepts are intentionally simplified for clarity. MCP is an open standard.
