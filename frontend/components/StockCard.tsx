import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Forecast } from '@/hooks/useMarketData';

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

    return (
        <Card className="flex items-center justify-between p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />

            <div className="z-10">
                <div className="flex items-center gap-3 mb-2">
                    {/* Logo Placeholder */}
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {symbol[0]}
                    </div>
                    <Badge variant="info" icon={false} className="bg-neon-cyan/20 border-neon-cyan/50 text-white">
                        TradeMind AI
                    </Badge>
                    {forecast && (
                        <Badge variant={forecast.direction === 'Up' ? 'bullish' : 'bearish'} className="animate-pulse">
                            AI Forecast: {forecast.direction === 'Up' ? '+' : ''}{forecast.predicted_change_percent}%
                        </Badge>
                    )}
                </div>

                <h2 className="text-5xl font-bold text-white tracking-tight mb-2 text-glow-cyan">
                    {symbol}
                </h2>

                <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold text-white">{price}</span>
                    <Badge variant={isPositive ? 'bullish' : 'bearish'}>
                        {change} ({changePercent}%)
                    </Badge>
                    <span className="text-gray-400 text-sm">Today</span>
                </div>
            </div>

            {/* Life Movement Gauge (RSI) */}
            <div className="z-10 flex flex-col items-center">
                <div className="uppercase text-[10px] tracking-wider text-gray-400 mb-2">Relative Strength (RSI)</div>
                <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="transparent"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 * (1 - sentiment / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#00f3ff" />
                                <stop offset="100%" stopColor="#9d00ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{sentiment}</span>
                        <span className={`text-[9px] uppercase ${sentimentColor}`}>{sentimentLabel}</span>
                    </div>
                </div>
                {forecast && (
                    <div className="text-[10px] text-gray-500 mt-2 text-center max-w-[100px]">
                        Target: ${forecast.predicted_price} ({forecast.confidence} Conf)
                    </div>
                )}
            </div>
        </Card>
    );
}
