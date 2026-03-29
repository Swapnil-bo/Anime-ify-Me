# ⚡ ANIME-IFY ME

### *Describe yourself. Become legend.*

**Forge your anime identity using a 7B language model running entirely on your machine.**  
No API keys. No cloud. No data leaves your device.

<br/>

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)
![Mistral](https://img.shields.io/badge/Mistral_7B-Instruct-e63946?style=flat-square)
![Ollama](https://img.shields.io/badge/Ollama-Local-ffd60a?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=flat-square)
![No API Keys](https://img.shields.io/badge/API_Keys-None-2ec4b6?style=flat-square)

<br/>

> *"Not chosen by fate — but by what you refused to let break you twice."*

</div>

---

## 魂 What Is This

**Anime-ify Me** is a fully local AI web application. You describe yourself — your personality, contradictions, wounds, passions — and a locally running **Mistral 7B Instruct** model forges you into a complete anime character profile.

Not a generic "brave warrior with fire powers." A lore-rich, emotionally specific character that could actually exist in an anime series — with a named technique, an unresolved backstory wound, a stat block, a rival, and a catchphrase.

**Everything runs on your machine. Mistral 7B processes your input locally via Ollama. Zero network calls to any AI service.**

---

## 剣 What It Generates

Every forge produces a complete character sheet:

| Field | Example Output |
|---|---|
| **Anime Name** | `Kurogane Sōma` |
| **Epithet** | *The Ash-Born Saint* |
| **Archetype** | *The Fractured Idealist Who Smiles Through The Pain* |
| **Backstory** | 3 sentences. One wound. One defining moment. Left open. |
| **Power Name** | `Void Resonance` |
| **Signature Technique** | `Crimson Requiem: burns only what you've already lost` |
| **Power Origin** | How their trauma gave birth to the ability |
| **Stat Block** | STR / INT / CHI / WILL / SHADOW — scored 0–100 with tier labels |
| **Total Power Index** | Sum across all five stats out of 500 |
| **Anime Universe** | Specific series + why its themes match their soul |
| **Narrative Rival** | Who their foil is and the nature of their conflict |
| **Moral Alignment** | Chaotic Good / Lawful Neutral / etc. |
| **Catchphrase** | Word-by-word dramatic reveal |
| **Theme Song** | A real anime OST that matches their energy |

---

## 星 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│   React + Vite + Tailwind + Framer Motion               │
│                                                         │
│   InputForm → App (state machine) → AnimeCard           │
│                    ↓ LoadingScreen                      │
└──────────────────┬──────────────────────────────────────┘
                   │ /api/animify (POST)
                   │ Vite proxy → localhost:8000
                   ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                       │
│                                                         │
│   prompt.py → build_prompt(description)                 │
│   main.py   → POST /api/animify                         │
│             → extract_json() with markdown fallback     │
│             → validate_character() + deep stats check   │
│             → GET /health (Ollama status check)         │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP POST localhost:11434/api/generate
                   ▼
┌─────────────────────────────────────────────────────────┐
│                     Ollama                              │
│              mistral:7b-instruct                        │
│         Running fully local on your GPU/CPU             │
└─────────────────────────────────────────────────────────┘
```

### Why Local?

- **Privacy** — your self-description never leaves your machine
- **No rate limits** — forge as many characters as you want
- **No API costs** — Mistral 7B runs free after download
- **Portfolio signal** — demonstrates real local LLM integration, not just API wrapping

---

## 力 Tech Stack

### Backend
- **FastAPI** — async Python API
- **Ollama** — local model runner
- **Mistral 7B Instruct** — creative writing powerhouse
- **httpx** — async HTTP client with 120s timeout for local inference
- **Pydantic** — request validation with character + stats deep validation

### Frontend
- **React 18** — component architecture
- **Vite 5** — blazing fast dev server with `/api` proxy
- **Tailwind CSS v3** — full custom design token system
- **Framer Motion 11** — page transitions, stat bar reveals, word-by-word catchphrase
- **Custom Canvas Particle System** — 28 drifting crimson/gold embers
- **No UI library** — every component hand-crafted

### Design System
- **Fonts**: Cinzel Decorative (titles) · Cinzel (headings) · Rajdhani (UI) · Noto Serif JP (lore) · Zen Antique Soft (catchphrase)
- **Palette**: `--void` · `--crimson` · `--soul-gold` · `--power-blue` · `--shadow-purple` · `--sage`
- **Easing**: `cubic-bezier(0.19, 1, 0.22, 1)` — the expo-out that makes everything feel like anime UI

---

## 炎 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| Ollama | Latest |
| GPU VRAM | 6GB+ recommended |

### 1 — Install Ollama + Pull Model

```bash
# Install Ollama from https://ollama.ai
ollama pull mistral:7b-instruct
```

### 2 — Clone & Set Up Backend

```bash
git clone https://github.com/Swapnil-bo/Anime-ify-Me.git
cd Anime-ify-Me/backend

pip install -r requirements.txt
```

### 3 — Set Up Frontend

```bash
cd ../frontend
npm install
```

### 4 — Run All Three Terminals

**Terminal 1 — Ollama**
```bash
ollama serve
```

**Terminal 2 — Backend**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

### 5 — Open

```
http://localhost:5173
```

---

## 道 Project Structure

```
anime-ify-me/
│
├── backend/
│   ├── main.py          # FastAPI — /api/animify + /health
│   ├── prompt.py        # KAGAMI prompt — god-mode character architect
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.jsx      # Cycling placeholders, char meter, prompt sparks
│   │   │   ├── LoadingScreen.jsx  # Kanji ring, 6 forge stages, haiku cycles
│   │   │   └── AnimeCard.jsx      # Full character sheet with all animations
│   │   ├── App.jsx        # State machine + particle system + animated header
│   │   ├── index.css      # Full design token system + all component classes
│   │   └── main.jsx
│   ├── index.html         # Custom cursor + preloader + kanji atmosphere
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 影 The Prompt Engineering

The heart of the project is `prompt.py` — a carefully engineered system prompt that instructs Mistral to become **KAGAMI**, the world's most legendary anime character architect.

Key constraints baked into the prompt:

```
✦ Backstory must NOT resolve the wound — leave it open
✦ Power technique format: "Name: what it does and what it costs emotionally"  
✦ Avoid Naruto/One Piece/DBZ unless it's a genuinely perfect thematic match
✦ Stat values must be integers between 0–100 — flaws make characters real
✦ Rival in one sentence — narrative foil and the core tension between them
✦ Respond ONLY in JSON — no markdown, no preamble, no explanation
```

The backend's `extract_json()` function handles cases where Mistral wraps output in markdown code blocks despite being told not to — a double-try pattern (direct parse → regex fallback) that makes the pipeline resilient to local model inconsistency.

---

## 詩 UI Highlights

### InputForm
- 7 rotating placeholder examples cycle every 4 seconds when unfocused
- Character meter: Gold (typing) → Sage glow (sweet spot 60–300 chars) → Crimson (too long)
- 5 prompt spark chips that append to existing text without wiping it
- `⌘ + Enter` keyboard shortcut

### LoadingScreen
- Kanji ring with 8 orbiting characters — active one glows at center
- 6 forge stages: *"Reading your soul"* → *"Sealing your catchphrase"*
- Crimson scan line sweeps the panel every 3.4 seconds
- 5 original haiku poems cycle every 12 seconds
- Live elapsed timer — shows Mistral is working, not frozen

### AnimeCard
- TV-on entry flash + horizontal scan sweep on card load
- Alignment-colored ambient glow (Chaotic = crimson, Good = sage, Evil = purple)
- Dividers draw left-to-right like a blade being unsheathed
- Stats slide in individually, bars fill with leading glow dot
- Catchphrase revealed word-by-word with blur-fade stagger
- Total Power Index = sum of all five stats out of 500
- One-click ASCII character sheet copy for sharing

---

## 宇宙 API Reference

### `POST /api/animify`

**Request**
```json
{
  "description": "A quiet overthinker who laughs too loud to hide the silence..."
}
```

**Response**
```json
{
  "success": true,
  "character": {
    "anime_name": "Kurogane Sōma",
    "title": "The Ash-Born Saint",
    "archetype": "The Fractured Idealist Who Smiles Through The Pain",
    "backstory": "...",
    "power_name": "Void Resonance",
    "technique": "Crimson Requiem: burns only what you've already lost",
    "power_origin": "...",
    "stats": {
      "STR": 42,
      "INT": 88,
      "CHI": 76,
      "WILL": 91,
      "SHADOW": 63
    },
    "anime_universe": "...",
    "rival": "...",
    "alignment": "Chaotic Good",
    "catchphrase": "...",
    "theme_song": "Unravel — TK from Ling Tosite Sigure"
  }
}
```

### `GET /health`

Returns Ollama connection status and available models.

```json
{
  "status": "ok",
  "ollama": "connected",
  "mistral_ready": true,
  "available_models": ["mistral:7b-instruct"]
}
```

---

## 名 Model Configuration

The Ollama call is tuned for creative stability on constrained hardware:

```python
"options": {
    "temperature":    0.85,   # Creative but JSON-stable
    "top_p":          0.9,
    "repeat_penalty": 1.1,    # Avoids repetitive phrasing
    "num_predict":    900,    # Fits full JSON, safe for 6GB VRAM
}
```

`timeout=120.0` gives Mistral breathing room on CPU fallback.

---

## 戦闘 Hardware Notes

Tested on:
- **GPU**: NVIDIA RTX 3050 6GB VRAM
- **RAM**: 8GB DDR4
- **OS**: Windows 11
- **Generation time**: ~25–60 seconds depending on GPU load

If your GPU has less than 6GB VRAM, Ollama will offload layers to CPU — generation will be slower but still functional.

---

<div align="center">

---

*Built as part of the 100 Days of Vibe Coding challenge.*  
*Every component hand-crafted. Every animation intentional. Every kanji earned.*

**github.com/Swapnil-bo/Anime-ify-Me**

```
魂  ·  力  ·  剣
Soul · Power · Blade
```

</div>
