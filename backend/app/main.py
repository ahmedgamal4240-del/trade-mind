
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import requests
import json

# Import our modules
from .market_data import get_market_data, get_news, init_news_api
from .strategy_engine import analyze_chart, init_gemini
from .analysis_engine import calculate_technical_indicators, train_and_predict

# Load environment variables
load_dotenv()

# Initialize APIs
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if NEWS_API_KEY:
    init_news_api(NEWS_API_KEY)
if GEMINI_API_KEY:
    init_gemini(GEMINI_API_KEY)

# Initialize Supabase
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase Init Error: {e}")

app = FastAPI(title="TradeMind API")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    image_url: str
    mode: str
    ticker: str = "General" # Added ticker for hybrid analysis context

@app.get("/")
def read_root():
    return {"message": "TradeMind Backend is Running"}

@app.get("/api/market-data/{ticker}")
def market_data_endpoint(ticker: str):
    """
    Returns price history, news, and technical analysis for a ticker.
    """
    # Sanitize ticker (remove $ if present)
    ticker = ticker.replace("$", "").upper()

    # 1. Get DataFrame for analysis
    df = get_market_data(ticker, return_df=True)
    
    # 2. Get Price Data for Charts
    price_data = get_market_data(ticker, return_df=False) # Use cached version
    
    # 2. Get News & Sentiment
    news_data = get_news(ticker)
    news = news_data['news']
    news_sentiment = {
        "score": news_data['sentiment_score'],
        "mood": news_data['market_mood']
    }

    # 3. Calculate Indicators
    indicators = {}
    if not df.empty:
        indicators = calculate_technical_indicators(df)
    
    # 4. ML Prediction
    forecast = {}
    if not df.empty:
        forecast = train_and_predict(df)

    return {
        "ticker": ticker,
        "price": price_data[0]['close'] if price_data else 0,
        "market_data": price_data,
        "news": news,
        "news_sentiment": news_sentiment,
        "indicators": indicators,
        "forecast": forecast
    }

@app.post("/api/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    """
    Analyzes chart from Supabase Storage URL uses Hybrid Intelligence (Vision + Stats).
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    try:
        # 1. Download image
        response = requests.get(request.image_url)
        response.raise_for_status()
        image_bytes = response.content
        
        # 2. Get Quantitative Context (Hybrid Analysis)
        quant_context = {}
        if request.ticker and request.ticker != "General":
            df = get_market_data(request.ticker, return_df=True)
            if not df.empty:
                quant_context = calculate_technical_indicators(df)

        # 3. Analyze with Gemini (Vision + Stats)
        analysis = analyze_chart(image_bytes, request.mode, context=quant_context)
        
        # 4. Save to Supabase
        if supabase:
            try:
                data = {
                    "image_url": request.image_url,
                    "strategy_type": request.mode,
                    "gemini_response": json.dumps(analysis),
                    "ticker": request.ticker
                }
                supabase.table("analysis_history").insert(data).execute()
            except Exception as e:
                print(f"Supabase Save Error: {e}")
                
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    message: str
    image_url: str = None
    ticker: str = "General"

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """
    General Chat endpoint.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")

    try:
        # 1. Get Context (Market Data) if ticker is provided
        market_context = {}
        if request.ticker and request.ticker != "General":
            try:
                # Basic price data
                price_data = get_market_data(request.ticker, return_df=False)
                if price_data:
                    current = price_data[0]
                    market_context = {
                        "Price": current.get('close'),
                        "Volume": current.get('volume'),
                        "Date": current.get('time')
                    }
            except Exception as e:
                print(f"Context error: {e}")

        # 2. Handle Image if present
        image_bytes = None
        if request.image_url:
            try:
                r = requests.get(request.image_url)
                if r.status_code == 200:
                    image_bytes = r.content
            except Exception as e:
                print(f"Image download error: {e}")

        # 3. Call AI
        from .strategy_engine import chat_with_ai
        response_text = chat_with_ai(request.message, image_bytes, market_context)
        
        return {"response": response_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
