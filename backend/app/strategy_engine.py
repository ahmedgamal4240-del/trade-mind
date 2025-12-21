import google.generativeai as genai
import os
import json
from PIL import Image
import io

# Initialize Gemini
def init_gemini(api_key: str):
    genai.configure(api_key=api_key)

STRATEGY_PROMPTS = {
    "General Analysis": """
        Act as a professional financial analyst. Analyze this financial chart (Stock, Crypto, Forex, or Commodity). 
        Identify the overall trend, key support/resistance levels, and volume profile.
        Provide a summary of the market structure and the asset's current phase.
    """,
    "Trap Detector": """
        Act as a professional trader specialized in "Trap Trading". 
        Analyze this chart specifically looking for Bull Traps or Bear Traps.
        Identify wicks that rejected key levels, fake-outs, or liquidity grabs.
        Confidently state if a trap is present or forming on this asset.
    """,
    "Reversal Hunter": """
        Act as a counter-trend specialist. Look for potential reversal patterns (Double Top/Bottom, Head & Shoulders, Wedge).
        Analyze momentum divergence if visible (or infer from candle strength).
        Identify entry criteria for a reversal trade.
    """,
    "Momentum Scalp": """
        Act as a momentum day trader. Analyze this chart for "Gap and Go" or strong trend continuation setups.
        Look for strong breakout candles and consolidation flags.
        Suggest a quick scalp entry and tight stop loss.
    """,
    "Elliott Wave": """
        Act as an Elliott Wave practitioner. Analyze the market structure for 5-wave motive and 3-wave corrective phases.
        Identify the current wave count (e.g., "Wave 3 of 5").
        Project potential fibonacci extension targets based on the wave structure.
    """,
    "Wyckoff Method": """
        Act as a Wyckoff Method expert. Analyze the market phases (Accumulation, Markup, Distribution, Markdown).
        Look for Specific events: Springs, Upthrusts (UTAD), Sign of Strength (SOS).
        Determine if the smart money is accumulating or distributing positions.
    """,
    "Harmonic Patterns": """
        Act as a Harmonic Pattern trader. Scan the chart for XABCD patterns (Gartley, Butterfly, Bat, Crab).
        Identify potential Reversal Zones (PRZ) based on fibonacci ratios.
        Confirm validity of potential patterns.
    """
}

# Standard output format instruction
OUTPUT_FORMAT = """
    Return the response strictly as a JSON object with the following keys:
    {
        "Detected Pattern": "Name of pattern found or 'None'",
        "Strategy": "Actionable advice based on the mode",
        "Entry Price": "Specific price or 'Market'",
        "Stop Loss": "Specific price",
        "Risk Level": "High/Medium/Low"
    }
    Do not add markdown formatting like ```json ... ```. Just the raw JSON string.
"""

def analyze_chart(image_bytes, mode="General Analysis", context=None):
    """
    Sends image and prompt to Gemini.
    Context: Optional dict containing technical indicators (RSI, MACD etc)
    """
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = STRATEGY_PROMPTS.get(mode, STRATEGY_PROMPTS["General Analysis"])
    
    # Enhance prompt with quantitative data if available
    if context:
        context_str = "\n\n**Quantitative Technical Data (Calculated):**\n"
        for k, v in context.items():
            context_str += f"- {k}: {v}\n"
        context_str += "\nUse this data to confirm visual patterns. E.g. if RSI is > 70, confirm overbought conditions visually.\n"
        prompt += context_str

    full_prompt = f"{prompt}\n\n{OUTPUT_FORMAT}"
    
    try:
        # Load image
        image = Image.open(io.BytesIO(image_bytes))
        
        response = model.generate_content([full_prompt, image])
        
        # Clean response to ensure valid JSON
        text_resp = response.text.strip()
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:]
        if text_resp.endswith("```"):
            text_resp = text_resp[:-3]
            
        return json.loads(text_resp)
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        return {
            "Detected Pattern": "Error",
            "Strategy": "Could not analyze chart.",
            "Entry Price": "N/A",
            "Stop Loss": "N/A",
            "Risk Level": "Unknown"
        }

def chat_with_ai(message: str, image_bytes=None, context=None):
    """
    General Chat with financial context.
    Returns a plain text response or markdown.
    """
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    system_prompt = """
    You are TradeMind, an advanced AI Trading Consultant.
    Your goal is to provide helpful, accurate, and cautious financial insights.
    
    - If asked about specific stocks, analyze them using your training data.
    - If provided with recent market data (in context), usage it to support your answer.
    - Always warn about risks. Do not give financial advice as absolute fact.
    - Be concise and professional.
    """
    
    # Enhance prompt with market data if available
    if context:
        context_str = "\n\n**Current Market Data:**\n"
        for k, v in context.items():
            context_str += f"- {k}: {v}\n"
        message = f"{context_str}\n\nUser Question: {message}"
    else:
        message = f"User Question: {message}"
        
    full_prompt = f"{system_prompt}\n\n{message}"
    
    try:
        content = [full_prompt]
        if image_bytes:
            image = Image.open(io.BytesIO(image_bytes))
            content.append(image)
            
        response = model.generate_content(content)
        return response.text
    except Exception as e:
        print(f"Gemini Chat Error: {e}")
        return "I'm having trouble connecting to the market neural network right now. Please try again later."
