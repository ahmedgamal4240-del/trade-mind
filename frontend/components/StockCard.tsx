'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Forecast } from '@/hooks/useMarketData';
import { TradeModal } from './TradeModal';
import { usePortfolio } from '@/hooks/usePortfolio';

interface StockCardProps {
    symbol: string;
    price: string;
    change: string;
    changePercent: string;
    sentiment: number; // 0-100 (RSI)
    forecast?: Forecast | null;
}

export function StockCard({ symbol, price, change, changePercent, sentiment, forecast }: StockCardProps) {
    const isPositive = !change.startsWith('-');

    // Determine sentiment label based on RSI
    const sentimentLabel = sentiment > 70 ? "Overbought" : sentiment < 30 ? "Oversold" : "Neutral";
    const sentimentColor = sentiment > 70 ? "text-neon-pink" : sentiment < 30 ? "text-neon-green" : "text-neon-cyan";

    const [isTradeModalOpen, setIsTradeModalOpen] = React.useState(false);
    const [tradeType, setTradeType] = React.useState<'buy' | 'sell'>('buy');
    const { executeTrade } = usePortfolio();

    // Ensure clean price number for calculations
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

    const handleTrade = (type: 'buy' | 'sell') => {
        setTradeType(type);
        setIsTradeModalOpen(true);
    };

    const confirmTrade = async (qty: number) => {
        try {
            await executeTrade(symbol, tradeType, qty, numericPrice);
            // Optional: Show success toast
            console.log("Trade executed successfully");
        } catch (error) {
            alert(error instanceof Error ? error.message : "Trade failed");
        }
    };

    return (
        <>
            <Card className="flex flex-col md:flex-row items-center justify-between p-6 relative overflow-visible group gap-6 md:gap-0">
                {/* Background Texture & Glow */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-xl">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="white" fillOpacity="0.3" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-neon-cyan/5 rounded-full blur-[40px] md:blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

                <div className="z-10 relative flex-1 w-full md:w-auto">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Logo Placeholder */}
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold shadow-lg">
                            {symbol[0]}
                        </div>
                        <Badge variant="info" icon={false} className="bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan/80">
                            TradeMind AI
                        </Badge>
                        {forecast && (
                            <Badge variant={forecast.direction === 'Up' ? 'bullish' : 'bearish'} className="animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                                AI Forecast: {forecast.direction === 'Up' ? '+' : ''}{forecast.predicted_change_percent}%
                            </Badge>
                        )}
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 tracking-tighter mb-1 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {symbol}
                    </h2>

                    <div className="flex items-baseline gap-4 mt-2">
                        <span className="text-2xl md:text-3xl font-medium text-white tracking-tight">{price}</span>
                        <Badge variant={isPositive ? 'bullish' : 'bearish'} className="px-2 py-1 text-sm">
                            {change} ({changePercent}%)
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 z-10 w-full md:w-auto min-w-[140px]">
                    <button
                        onClick={() => handleTrade('buy')}
                        className="flex-1 bg-neon-green/10 hover:bg-neon-green text-neon-green hover:text-black border border-neon-green/50 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                    >
                        BUY
                    </button>
                    <button
                        onClick={() => handleTrade('sell')}
                        className="flex-1 bg-neon-red/10 hover:bg-neon-red text-neon-red hover:text-white border border-neon-red/50 px-4 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-[0_0_15px_rgba(255,59,48,0.1)]"
                    >
                        SELL
                    </button>
                </div>

                {/* Life Movement Gauge (RSI) */}
                <div className="z-10 flex flex-col items-center relative group/gauge hidden md:flex ml-8">
                    <div className="uppercase text-[10px] font-bold tracking-widest text-gray-500 mb-3 group-hover/gauge:text-neon-cyan transition-colors">Momentum (RSI)</div>
                    <div className="relative w-28 h-28">
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-cyan/20 to-neon-purple/20 blur-xl opacity-0 group-hover/gauge:opacity-100 transition-opacity" />

                        <svg className="w-full h-full -rotate-90 relative z-10">
                            {/* Background Circle */}
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                stroke="url(#gradient)"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray="301.6" // 2 * pi * 48
                                strokeDashoffset={301.6 * (1 - sentiment / 100)}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f3ff" />
                                    <stop offset="100%" stopColor="#9d00ff" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{sentiment}</span>
                            <span className={`text-[9px] uppercase font-bold tracking-wider ${sentimentColor}`}>{sentimentLabel}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <TradeModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                type={tradeType}
                symbol={symbol}
                price={numericPrice}
                onConfirm={confirmTrade}
            />
        </>
    );
}
