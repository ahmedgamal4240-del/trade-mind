import yfinance as yf
from newsapi import NewsApiClient
import os
from datetime import datetime, timedelta

# Initialize NewsAPI (ensure api key is set in env)
# We will load env vars in main.py usually, but good to have safety here
newsapi = None

def init_news_api(api_key: str):
    global newsapi
    newsapi = NewsApiClient(api_key=api_key)

import pandas as pd
from functools import lru_cache
import time

# Simple in-memory cache with expiration
cache = {}
CACHE_DURATION = 15 # 15 seconds for "live" feel

def get_market_data(ticker: str, period: str = "1mo", interval: str = "1d", return_df: bool = False):
    """
    Fetches historical data from yfinance.
    Supports caching and returning raw DataFrame.
    """
    cache_key = f"{ticker}_{period}_{interval}"
    
    # Check cache
    if cache_key in cache:
        timestamp, data, df = cache[cache_key]
        if time.time() - timestamp < CACHE_DURATION:
            return df if return_df else data

    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)
        
        if hist.empty:
            raise Exception("No data found")

        # Reset index to make Date a column
        hist.reset_index(inplace=True)
        
        # Format for Lightweight Charts (time: string/timestamp, open, high, low, close)
        # Lightweight charts expects 'time' as YYYY-MM-DD for daily bars
        data = []
        for index, row in hist.iterrows():
            # Handle different date formats if needed, but YYYY-MM-DD is standard
            time_str = row['Date'].strftime('%Y-%m-%d')
            data.append({
                "time": time_str,
                "open": row['Open'],
                "high": row['High'],
                "low": row['Low'],
                "close": row['Close'],
                "volume": row['Volume']
            })
            
        # Update Cache
        cache[cache_key] = (time.time(), data, hist)
        
        return hist if return_df else data
    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        
        # Fallback to Mock Data (20 days) if API fails
        print(f"Generating mock data for {ticker}...")
        mock_data = []
        base_price = 150.0
        if ticker == "BTC-USD": base_price = 60000.0
        
        # Generate last 30 days
        for i in range(30):
            dt = (datetime.now() - timedelta(days=29-i)).strftime('%Y-%m-%d')
            import random
            change = random.uniform(-0.05, 0.05)
            close = base_price * (1 + change)
            open_p = base_price * (1 + random.uniform(-0.02, 0.02))
            high = max(open_p, close) * (1 + random.uniform(0, 0.02))
            low = min(open_p, close) * (1 - random.uniform(0, 0.02))
            
            mock_data.append({
                "time": dt,
                "open": round(open_p, 2),
                "high": round(high, 2),
                "low": round(low, 2),
                "close": round(close, 2),
                "volume": int(random.uniform(1000000, 5000000))
            })
            base_price = close
            
        return pd.DataFrame(mock_data) if return_df else mock_data

# Financial Sentiment Dictionary (Lightweight)
SENTIMENT_LEXICON = {
    'bullish': ['surge', 'jump', 'rise', 'gain', 'climb', 'soar', 'rocket', 'bull', 'buy', 'outperform', 'upgrade', 'beat', 'record', 'strong', 'positive', 'growth', 'profit'],
    'bearish': ['plunge', 'drop', 'fall', 'sink', 'dive', 'crash', 'bear', 'sell', 'underperform', 'downgrade', 'miss', 'weak', 'negative', 'loss', 'debt', 'risk', 'crisis']
}

def analyze_sentiment(text: str) -> float:
    """
    Returns a sentiment score between -1.0 (Bearish) and 1.0 (Bullish).
    """
    if not text:
        return 0.0
    
    text_lower = text.lower()
    score = 0.0
    
    for word in SENTIMENT_LEXICON['bullish']:
        if word in text_lower:
            score += 0.3
            
    for word in SENTIMENT_LEXICON['bearish']:
        if word in text_lower:
            score -= 0.3
            
    # Clamp score
    return max(min(score, 1.0), -1.0)

def get_news(ticker: str):
    """
    Fetches news from Yahoo Finance (Public) first, then falls back to NewsAPI.
    Calculates Market Mood based on aggregated sentiment.
    """
    global newsapi
    news_items = []
    
    # 1. Try Yahoo Finance (Public Source)
    try:
        yf_ticker = yf.Ticker(ticker)
        
        # Skip YF for "GENERAL" as it's not a valid ticker, or use S&P 500
        if ticker.upper() == "GENERAL":
             yf_ticker = yf.Ticker("^GSPC") # S&P 500

        yf_news = yf_ticker.news
        
        if yf_news:
            for item in yf_news:
                title = item.get('title', '')
                # Skip non-news items like videos if needed, but titles are usually enough
                
                # Normalize Timestamp
                pub_time = item.get('providerPublishTime', 0)
                pub_date = datetime.fromtimestamp(pub_time).strftime('%Y-%m-%dT%H:%M:%SZ') if pub_time else datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
                
                # Analyze Sentiment
                score = analyze_sentiment(title)
                sentiment_label = "Neutral"
                if score > 0.1: sentiment_label = "Positive"
                elif score < -0.1: sentiment_label = "Negative"
                
                news_items.append({
                    "title": title,
                    "url": item.get('link', '#'),
                    "source": item.get('publisher', 'Yahoo Finance'),
                    "publishedAt": pub_date,
                    "sentiment": sentiment_label,
                    "score": round(score, 2)
                })
    except Exception as e:
        print(f"YFinance News Error for {ticker}: {e}")

    # 2. If YF failed or returned few results, try NewsAPI (if configured)
    if len(news_items) < 3 and newsapi:
        try:
            # Search for ticker in last 7 days
            start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            
            query = ticker
            if ticker.upper() == "GENERAL":
                 query = "Stock Market, Economy, Finance"

            response = newsapi.get_everything(
                q=query,
                from_param=start_date,
                language='en',
                sort_by='relevancy',
                page_size=5 - len(news_items) # Fill remaining slots
            )
            
            articles = response.get('articles', [])
            
            for art in articles:
                title = art.get('title', '')
                score = analyze_sentiment(title)
                
                sentiment_label = "Neutral"
                if score > 0.1: sentiment_label = "Positive"
                elif score < -0.1: sentiment_label = "Negative"
                
                # Dedup based on title similarity could go here, but simple append for now
                news_items.append({
                    "title": title,
                    "url": art.get('url'),
                    "source": art.get('source', {}).get('name'),
                    "publishedAt": art.get('publishedAt'),
                    "sentiment": sentiment_label,
                    "score": round(score, 2)
                })
                
        except Exception as e:
            print(f"NewsAPI Error for {ticker}: {e}")

    # 3. Calculate Aggregated Mood
    if not news_items:
        return {
            "news": [{"title": "No recent news found", "url": "#", "source": "System", "sentiment": "Neutral", "score": 0}],
            "sentiment_score": 0,
            "market_mood": "Neutral"
        }

    total_score = sum(item['score'] for item in news_items)
    avg_score = total_score / len(news_items)
    
    market_mood = "Neutral"
    if avg_score > 0.1: market_mood = "Bullish"
    if avg_score > 0.4: market_mood = "Strong Bullish"
    if avg_score < -0.1: market_mood = "Bearish"
    if avg_score < -0.4: market_mood = "Strong Bearish"

    return {
        "news": news_items[:10], # Limit to top 10
        "sentiment_score": round(avg_score, 2),
        "market_mood": market_mood
    }
