import { useState, useEffect } from 'react';

export interface MarketData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface NewsItem {
    title: string;
    url: string;
    source: string;
    publishedAt: string;
    sentiment?: 'Positive' | 'Negative' | 'Neutral';
    score?: number;
}

export interface NewsSentiment {
    score: number;
    mood: string;
}

export interface Indicators {
    rsi: number;
    rsi_state: string;
    macd: number;
    macd_signal: string;
    bb_position: number;
    current_price: number;
    golden_cross: boolean;
    ichimoku_status: string;
    atr: number;
    obv: number;
}

export interface Forecast {
    predicted_price: number;
    predicted_change_percent: number;
    direction: "Up" | "Down";
    confidence: "High" | "Medium" | "Low";
}

export const useMarketData = (ticker: string) => {
    const [marketData, setMarketData] = useState<any[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsSentiment, setNewsSentiment] = useState<NewsSentiment>({ score: 0, mood: 'Neutral' });
    const [indicators, setIndicators] = useState<Indicators | null>(null);
    const [forecast, setForecast] = useState<Forecast | null>(null);
    const [sentiment, setSentiment] = useState({ label: 'Neutral', color: 'text-gray-400', value: 50 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchData = async () => {
            setLoading(prev => prev === false); // Don't trigger full loading spinner on background refresh
            try {
                // Fetch from FastAPI
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/market-data/${ticker}`);
                const data = await res.json();

                // Only update if we have valid data
                if (data.market_data) {
                    console.log(`useMarketData: Fetched ${data.market_data.length} candles for ${ticker}`);
                    setMarketData(data.market_data);
                } else {
                    console.warn(`useMarketData: No market_data in response for ${ticker}`, data);
                }
                if (data.news) setNews(data.news);
                if (data.news_sentiment) setNewsSentiment(data.news_sentiment);
                if (data.indicators) {
                    setIndicators(data.indicators);
                    // Derive Technical Sentiment from RSI
                    const rsi = data.indicators.rsi;
                    let label = "Neutral";
                    let color = "text-gray-400";
                    if (rsi > 70) { label = "Bearish (Overbought)"; color = "text-neon-red"; }
                    if (rsi < 30) { label = "Bullish (Oversold)"; color = "text-neon-green"; }
                    setSentiment({ label, color, value: rsi });
                }
                if (data.forecast) setForecast(data.forecast);

            } catch (error) {
                console.error("Error fetching market data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Initial Fetch
        fetchData();

        // Poll every 10 seconds for "Live" feel
        intervalId = setInterval(fetchData, 10000);

        return () => clearInterval(intervalId);
    }, [ticker]);

    return { marketData, news, newsSentiment, indicators, forecast, sentiment, loading };
};
