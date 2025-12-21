'use client';

import React, { useState } from 'react';
import { StockCard } from './StockCard';
import { LiveChart } from './LiveChart';
import ChatInterface from './ChatInterface';
import { NewsTicker } from './NewsTicker';
import { StrategyCard } from './StrategyCard';
import { Button } from './ui/Button';
import { LayoutDashboard, Bell, Search, Menu } from 'lucide-react';
import { Input } from './ui/Input';


import { useMarketData } from '@/hooks/useMarketData';
import { useSidebar } from '@/lib/SidebarContext';

export default function Dashboard() {
    const [ticker, setTicker] = useState("TSLA");
    const [searchInput, setSearchInput] = useState("");
    const { marketData, news, newsSentiment, indicators, forecast, sentiment, loading } = useMarketData(ticker);
    const { toggle } = useSidebar();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setTicker(searchInput.toUpperCase());
            setSearchInput("");
        }
    };

    // Get latest price
    const latestPrice = marketData.length > 0 ? marketData[marketData.length - 1].close.toFixed(2) : "0.00";
    const prevPrice = marketData.length > 1 ? marketData[marketData.length - 2].close : 0;
    const change = marketData.length > 0 ? (Number(latestPrice) - prevPrice).toFixed(2) : "0.00";
    const changePercent = prevPrice ? ((Number(change) / prevPrice) * 100).toFixed(2) : "0.00";
    const changeSign = Number(change) >= 0 ? "+" : "";

    return (
        <div className="flex flex-col min-h-screen">
            {/* Mobile/Desktop Header with Search */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Icon would be handled by sidebar logic or layout, hidden here on desktop */}
                    <button onClick={toggle} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-white hidden md:block">Market Engine Dashboard</h1>
                </div>

                <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
                    <div className="flex gap-2">
                        {/* Quick Market Selectors (Visual helpers that could pre-fill or filter) */}
                        {['US', 'Crypto', 'Forex', 'Global'].map(m => (
                            <button
                                key={m}
                                onClick={() => {
                                    if (m === 'Crypto') setSearchInput('BTC-USD');
                                    if (m === 'Forex') setSearchInput('EURUSD=X');
                                    if (m === 'Global') setSearchInput('7203.T');
                                }}
                                className="text-[10px] font-bold uppercase text-gray-400 hover:text-white transition-colors"
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Input
                            placeholder="Search ticker (e.g. AAPL, BTC-USD, EURUSD=X)..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-black/40 border-white/10 focus:border-neon-cyan/50 pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    </form>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-neon-red rounded-full" />
                    </Button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-xs text-black">
                        TM
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 pb-24 md:pb-8">
                {/* Main Content Area */}
                <div className="col-span-1 xl:col-span-8 space-y-6">
                    {/* Top Row: Stock Card (Wide) */}
                    <StockCard
                        symbol={ticker}
                        price={`$${latestPrice}`}
                        change={`${changeSign}${change}`}
                        changePercent={changePercent}
                        sentiment={sentiment.value}
                        forecast={forecast}
                    />

                    {/* Chart Section */}
                    <LiveChart data={marketData} ticker={ticker} />

                    {/* Active Strategies Row */}
                    {/* ... rest of the file ... */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Active AI Strategies</h3>
                            <Button variant="ghost" className="text-xs text-neon-cyan">View All</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dynamic Strategies based on API Data */}
                            {indicators ? (
                                <>
                                    <StrategyCard
                                        title={indicators.macd_signal === "Bullish" ? "Momentum Breakout" : "Correction Play"}
                                        description={indicators.macd_signal === "Bullish"
                                            ? "MACD crossover detected indicating strong upward momentum. Recommended entry on pullbacks."
                                            : "Bearish MACD divergence. Potential short-term correction play targeting lower support."}
                                        sentiment={indicators.macd_signal === "Bullish" ? "bullish" : "bearish"}
                                        riskLevel={indicators.macd_signal === "Bullish" ? 6 : 8}
                                    />
                                    <StrategyCard
                                        title={indicators.rsi > 70 ? "Overbought Reversal" : (indicators.rsi < 30 ? "Oversold Bounce" : "RSI Neutral Hold")}
                                        description={`RSI is at ${indicators.rsi}. ${indicators.rsi > 70 ? "Price is extended, look for mean reversion." : (indicators.rsi < 30 ? "Price is undervalued, look for buyers." : "Market is in equilibrium, wait for clear signal.")}`}
                                        sentiment={indicators.rsi > 70 ? "warning" : (indicators.rsi < 30 ? "info" : "neutral")}
                                        riskLevel={5}
                                    />
                                </>
                            ) : (
                                // Fallback Loading State
                                <>
                                    <StrategyCard
                                        title="Initializing AI..."
                                        description="Gathering market data for strategy generation."
                                        sentiment="neutral"
                                        riskLevel={1}
                                    />
                                    <StrategyCard
                                        title="System Sync"
                                        description="Connecting to Neural Engine..."
                                        sentiment="neutral"
                                        riskLevel={1}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Chat & Signals */}
                <div className="col-span-1 xl:col-span-4 space-y-6">
                    <ChatInterface ticker={ticker} />

                    {/* Recent Signals / Watchlist Mini */}
                    <div className="glass-panel rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">News & Signals</h3>
                        <div className="space-y-4">
                            {news.length > 0 ? news.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div className="flex gap-3">
                                        <div className="min-w-[8px] h-2 mt-1 rounded-full bg-neon-cyan" />
                                        <a href={item.url} target="_blank" className="text-xs font-medium text-white hover:text-neon-cyan line-clamp-2 transition-colors">{item.title}</a>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-xs text-gray-500">Loading signals...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom News Ticker (Fixed or sticky at bottom of main content) */}
            <div className="mt-auto sticky bottom-[88px] md:bottom-0 z-30">
                <NewsTicker />
            </div>
        </div>
    );
}
