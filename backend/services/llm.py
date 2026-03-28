import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY", ""),
)

MODEL = "google/gemini-2.0-flash-001"


async def _ask_llm(system_prompt: str, user_prompt: str) -> str:
    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content or "No insights available."
    except Exception as e:
        return f"AI analysis unavailable: {str(e)}"


async def get_medical_insights(data: dict) -> str:
    system = "You are a campus health analytics AI. Analyze medical records data and provide actionable insights, predictions for next month, and risk warnings. Be concise and use bullet points."
    user = f"""Analyze this medical records data:
- Total records: {data.get('total', 0)}
- Top issues: {data.get('by_issue', [])}
- Severity breakdown: {data.get('by_severity', [])}
- Daily visit trends: {data.get('daily_visits', [])}
- Rising trends: {data.get('trends', [])}

Provide:
1. Key patterns observed
2. Predicted diseases likely next month
3. Risk warnings
4. Recommendations"""
    return await _ask_llm(system, user)


async def get_stationery_insights(data: dict) -> str:
    system = "You are a campus supply chain analytics AI. Analyze stationery store data and provide demand forecasts, restock recommendations, and shortage warnings. Be concise and use bullet points."
    user = f"""Analyze this stationery store data:
- Total items: {data.get('total', 0)}
- Top demand items: {data.get('top_demand', [])}
- Low stock items: {data.get('low_stock', [])}
- Category breakdown: {data.get('by_category', [])}

Provide:
1. Items most likely to be purchased next
2. Predicted peak visit timings
3. Shortage risk warnings
4. Restocking recommendations"""
    return await _ask_llm(system, user)


async def get_parking_insights(data: dict) -> str:
    system = "You are a campus parking analytics AI. Analyze parking data and provide occupancy forecasts, best parking times, and slot recommendations. Be concise and use bullet points."
    user = f"""Analyze this parking data:
- Total records: {data.get('total', 0)}
- Currently occupied: {data.get('occupied', 0)}
- Currently free: {data.get('free', 0)}
- Hourly distribution: {data.get('hourly', [])}
- Slot usage: {data.get('slot_usage', [])}

Provide:
1. Peak parking hours
2. Predicted busy times for tomorrow
3. Best slots to park in
4. Recommendations for reducing congestion"""
    return await _ask_llm(system, user)


async def generate_proposal(items: list) -> str:
    system = "You are a procurement AI for a campus stationery store. Generate a professional buying proposal document for low-stock items. Include item names, recommended quantities, estimated costs, and supplier notes. Format as a clean markdown document."
    user = f"""Generate a buying proposal for these low-stock items:
{items}

Include:
1. Header with date and store name
2. Items table with: Item Name, Current Stock, Recommended Order Quantity, Estimated Unit Price, Total Cost
3. Summary with total estimated budget
4. Notes and recommendations"""
    return await _ask_llm(system, user)


async def parse_voice_command(text: str, context: str) -> dict:
    system = f"""You are an AI assistant for a campus management system. Parse user voice commands into structured actions for the {context} module.
Return a JSON object with:
- "action": one of "create", "update", "delete", "search", "analyze"
- "data": relevant fields as key-value pairs
Be precise and extract all mentioned data fields."""
    user = f"Parse this command: {text}"
    result = await _ask_llm(system, user)
    return {"raw": result, "command": text}

