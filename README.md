# MonsoonShield AI ⛈️🛡️

**Live Deployment Link**: 🌐 [monsoon-shield-ai.vercel.app](https://monsoon-shield-ai.vercel.app/)

MonsoonShield AI is an AI-powered Monsoon Preparedness & Citizen Assistance platform built for the **Google Build with AI / PromptWars hackathon**. It helps individuals, families, and communities stay safe before, during, and after severe monsoon storms through Gemini-driven planning, risk evaluations, and safety overlays.

Designed with a premium **Google Material 3 inspired UI**, the application features rich dark/light theme switching, responsive layouts, voice command speech synthesis, offline PWA access, and interactive map grids.

---

## 🛠️ Deployed Version Updates & Technical Challenges

### 1. Monorepo Subdirectory Mappings (404 Page Not Found)
* **Challenge**: Deploying a project with separate `client/` and `server/` subfolders on Vercel and Netlify initially caused `Page Not Found` errors because the hosting platforms built the repository root directory by default (where no index file was located).
* **Update**: Configured build settings explicitly to designate `client` as the **Root/Package Directory**, with the build command set to `npm run build` and output folder routed to `client/dist`.

### 2. Tailwind CSS v4 Compiler Integration
* **Challenge**: The latest Tailwind CSS v4 engine uses a compiler that restricts legacy `@apply` directives from mixing opacity modifiers (`bg-white/70`, `bg-secondary-light/35`) and custom classes, resulting in PostCSS build failures.
* **Update**: Installed `@tailwindcss/postcss` and changed CSS file structures to utilize Tailwind v4's `@import "tailwindcss";` directive alongside standard CSS custom variables for opacities and borders.

### 3. API Precedence & Prompt Parsing Collision
* **Challenge**: The AI Preparedness Planner returned a blank screen during mock testing. This was traced to the server-side router, where the prompt for the planner contained keywords that matched the generic `riskscore` metric check first. The server returned a generic score payload, leaving checklist arrays undefined and causing a client-side component crash.
* **Update**: Re-ordered conditional logic in `server/src/index.ts` to parse the planner's checklist indicators first, ensuring structured payloads are fully resolved.

---

## 🚀 Key Features

1. **Landing Page**: Immersive storm background animations and core feature outlines.
2. **Citizen Dashboard**: Live weather telemetry cards, circular AI risk meters (0-100), active alerts, and rain charts.
3. **Safety Profile**: Formulates custom evacuation and travel plans based on elderly counts, vehicle height, and medical conditions.
4. **Preparedness Planner**: Gemini compiles chronological checklists (Morning/Noon/Night), food choices, and backup batteries.
5. **Route Advisor**: Analyzes travel paths, flood likelihoods under tunnels, traffic, and detour roads.
6. **Image Analyzer**: Scans street snapshots using Gemini Vision to spot standing water, tree falls, and high-voltage grid exposures.
7. **Community Alerts**: Interactively log flood blocks, power cuts, or tree falls onto the map. AI checks for duplicates before submission.
8. **Emergency SOS**: Tap-to-broadcast GPS signals, direct call relief cells, and generate instant SMS templates.
9. **Family Tracker**: Track status flags (Safe, Travelling, Offline, Needs Help) and locations of family circles.
10. **Nearby Relief**: Interactive search toggles for Shelters, Hospitals, Chargers, and Food camps.
11. **AI Chat Hub**: Hands-free voice assistant responding to verbal questions in multiple regional languages (Telugu, Hindi, English).
12. **Recovery Planner**: Flood aftermath support covering cleaning orders, insurance claim logging, and sanitization lists.
13. **Fake News Screen**: Paste viral messages or chat forwards to run facts analysis against meteorological facts.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, TypeScript, TailwindCSS v3, Framer Motion, TanStack Query, Recharts, Lucide Icons
* **Backend**: Node.js, Express, TypeScript, ts-node-dev
* **AI Engine**: Google Gemini 2.5 Flash SDK (`@google/generative-ai`)
* **API Providers**: OpenWeather API, Google Maps, Geolocation API, Web Speech API

---

## 📂 Project Structure

```
monsoonshield-ai/
├── client/                      # Vite Frontend Application
│   ├── public/                  # Static assets & manifest.json
│   ├── src/
│   │   ├── components/          # FloatingChat, map grids
│   │   ├── context/             # AppContext (theme, language, auth, offline)
│   │   ├── hooks/               # useSpeech, useGeolocation
│   │   ├── pages/               # All 13 Material 3 views
│   │   ├── prompts/             # Reusable Gemini prompt templates
│   │   ├── services/            # Weather & Gemini API services
│   │   ├── types/               # TypeScript interfaces
│   │   └── main.tsx             # Application entry point
│   ├── tailwind.config.js       # Color themes & shadows
│   └── package.json
└── server/                      # Express Backend Server
    ├── src/
    │   └── index.ts             # Express listeners & Gemini integrations
    ├── tsconfig.json
    └── package.json
```

---

## ⚙️ Setup & Startup Instructions

### Prerequisite
* Ensure **Node.js** (v18+) is installed on your computer.

### Step 1: Configuration
Copy the `.env.example` in the root folder into a new file named `.env` inside the `server/` directory:
```bash
cp .env.example server/.env
```
Open `server/.env` and insert your **Google Gemini API Key**:
```env
GEMINI_API_KEY=AIzaSy...
```

### Step 2: Start Express Backend
Run these commands from the project root directory:
```bash
cd server
npm install
npm run dev
```
The server will boot up at `http://localhost:5000`. If you didn't provide a Gemini API Key, the server logs a warning and engages mock fallbacks so you can test all features offline.

### Step 3: Start Vite Frontend
Open a new terminal window at the project root directory:
```bash
cd client
npm install
npm run dev
```
The frontend starts at `http://localhost:5173`. Open this URL in your web browser.

---

## 📦 PWA & Offline Support
* To install as a PWA, run a production build:
  ```bash
  cd client
  npm run build
  npm run preview
  ```
* Open the browser and click the "Install App" button in the address bar. The application will be installable on your Desktop/Mobile and runs without internet.

---

## 🐙 Push to GitHub

To push this project to a new repository on your GitHub account:

1. Open your terminal in the `monsoonshield-ai/` root folder.
2. Initialize git:
   ```bash
   git init
   ```
3. Create a `.gitignore` in the root folder containing:
   ```text
   node_modules/
   dist/
   .env
   .env.local
   ```
4. Stage and commit:
   ```bash
   git add .
   git commit -m "feat: initial commit for MonsoonShield AI PWA hackathon submission"
   ```
5. Create a blank repo on your GitHub account, copy its remote URL, and link it:
   ```bash
   git branch -M main
   git remote add origin <your_github_repo_url>
   git push -u origin main
   ```
