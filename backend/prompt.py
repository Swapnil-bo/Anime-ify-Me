def build_prompt(description: str) -> str:
    return f"""You are an anime character creator. Based on the user's description, create a unique anime character profile.

User description: {description}

Respond ONLY in this exact JSON format, nothing else:
{{
  "anime_name": "Their anime character name",
  "archetype": "Their archetype (e.g. The Silent Prodigy, The Lone Wanderer)",
  "backstory": "A 2-3 sentence emotional backstory",
  "power_name": "Name of their special power",
  "power_description": "One sentence describing what the power does",
  "anime_series": "The anime universe they belong to (existing or original)",
  "catchphrase": "Their signature catchphrase"
}}

Do not include any explanation, markdown, or text outside the JSON."""