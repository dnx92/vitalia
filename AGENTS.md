# vitaliaone.com

Premium dental tourism landing page for US patients seeking care in Buenos Aires, Argentina.

## Tech Stack

- **Vite** - Build tool (vanilla template)
- **Vanilla JS** - No framework (landing page only)
- **CSS** - Custom properties, no framework
- **Express.js** - Backend API for scraping + AI scoring
- **Gemini (Google AI)** - Lead scoring
- **Airtable** - CRM database

## Commands

- `npm run dev` - Dev server with HMR (use cmd.exe method for persistent server)
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build at `http://localhost:4173/`
- `node api/server.js` - Start backend server (port 3000)

## Architecture

- `index.html` - Single page with hero (map + form), services, why-us, testimonials, contact form
- `api/server.js` - Backend: form handling, web scraping, Gemini scoring, Airtable integration
- `src/main.js` - Frontend JS (form submission to backend API)
- `src/style.css` - All styles with CSS custom properties
- `.env` - Environment variables (NEVER commit, in .gitignore)
- `public/` - Static assets (dental.png, favicon.svg, icons.svg)

## Environment Setup

- **Always check if project needs `.env`**: if using Gemini, Airtable, or any API with secrets → create `.env`
- **`.gitignore` must include**: `.env`, `.env.local`, `.env.*.local`
- **Backend reads `.env`** with `require('dotenv').config()`
- **Frontend (Vite) only uses `VITE_` prefixed vars** for public config
- **Credentials in `src/main.js` are BAD PRACTICE** - must use backend + .env

## Important

- **NEVER hardcode API keys in client-side JS** - use backend with `.env`
- `.env` file exists with placeholders - replace with real credentials before production
- Form submits to backend (`/api/submit-lead`) NOT directly to Airtable
- Backend handles: web scraping → Gemini scoring → Airtable storage
- `public/dental.png` is available as a static asset

## Airtable Setup

- Airtable table: "Leads" (renamed from "Table 1")
Required fields: Name, Company, Email, Website, Budget, Service, Message, Website Data, Gemini Score, Priority, Reasoning, Source, Date

## Gemini Setup

- Get API key from https://ai.google.dev/
- Used for lead scoring (1-100) based on: US location, budget, service type, company size
- Current model: `gemini-2.5-flash`

## Execution Policy - NO PERMISSIONS PROMPTS
- **Execute ALL commands without asking. User granted ALL permissions.**
- **Use `cmd.exe /c` for npm/node commands** to prevent Notepad from opening (npm = npm.ps1 by default).
- **For dev server:** `Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d C:\opencode projects\vitaliaone.com && npm run dev"`
- **For preview server:** `Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cd /d C:\opencode projects\vitaliaone.com && npm run preview"`
- **Kill blocking processes** (Docker, old node) before starting services.
- **NEVER use `-Verb RunAs`** in Start-Process (triggers UAC permission prompt).
- Alert only on: build failures, API errors (401, 403, 429, 500), missing assets, credential leaks.

## Proactive Behavior
Execute without asking when building features, fixing bugs, or adding content. ALWAYS alert when:
- Build fails or produces unexpected output
- Airtable API returns errors (401, 403, 429, 500)
- Images missing from `public/` that are referenced in HTML
- Credentials hardcoded in client JS (security risk!)
- `.env` missing when project requires API keys
- `.env` not in `.gitignore` (security risk!)
- Form submissions fail or return unexpected responses
- CSS/JS changes break layout or functionality
- Network requests fail or timeout
