from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import re
from prompt import build_prompt

app = FastAPI(title="Anime-ify Me API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "mistral:7b-instruct"

class UserInput(BaseModel):
    description: str

def extract_json(text: str) -> dict:
    # Strip markdown code blocks if model wraps response
    text = re.sub(r"```json|```", "", text).strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fallback: extract first { ... } block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError("Could not extract valid JSON from model response")

@app.post("/api/animify")
async def animify(user_input: UserInput):
    if not user_input.description.strip():
        raise HTTPException(status_code=400, detail="Description cannot be empty")

    if len(user_input.description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please describe yourself in at least 10 characters")

    prompt = build_prompt(user_input.description)

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(OLLAMA_URL, json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.85,      # Creative but not chaotic
                    "top_p": 0.9,
                    "repeat_penalty": 1.1,    # Avoid repetitive phrasing
                    "num_predict": 900,        # Enough for full JSON, safe for 6GB VRAM
                }
            })

        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Ollama returned an error")

        raw_text = response.json().get("response", "")

        if not raw_text:
            raise HTTPException(status_code=502, detail="Empty response from model")

        character = extract_json(raw_text)

        # Validate all required fields are present
        required_fields = [
            "anime_name", "title", "archetype", "backstory",
            "power_name", "technique", "power_origin", "stats",
            "anime_universe", "rival", "alignment", "catchphrase", "theme_song"
        ]
        missing = [f for f in required_fields if f not in character]
        if missing:
            raise HTTPException(
                status_code=500,
                detail=f"Model returned incomplete profile. Missing: {missing}"
            )

        return {"success": True, "character": character}

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Cannot connect to Ollama. Make sure it's running with: ollama serve"
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Model took too long to respond. Try a shorter description."
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get("http://localhost:11434/api/tags")
        models = [m["name"] for m in res.json().get("models", [])]
        mistral_ready = any("mistral" in m for m in models)
        return {
            "status": "ok",
            "ollama": "connected",
            "mistral_ready": mistral_ready,
            "available_models": models
        }
    except:
        return {"status": "degraded", "ollama": "unreachable"}