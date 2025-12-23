'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from './ui/Card';

interface LiveChartProps {
    data: any[];
    ticker: string;
}

export function LiveChart({ data, ticker }: LiveChartProps) {
    const [timeframe, setTimeframe] = React.useState('1D');

    // Format data for Recharts if needed, but it accepts array of objects naturally
    // We just need to ensure 'time' and 'close' (or 'value') exist.
    // API data: { time: '2023-01-01', close: 150.00, ... }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    <p className="text-neon-cyan font-bold font-mono">
                        ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-6 h-[400px] flex flex-col relative overflow-hidden group border-white/5 bg-black/40">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="font-bold text-lg text-white tracking-tight">{ticker} USD</h3>
                        <p className="text-xs text-gray-400 font-mono">MARKET PRICE</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                        </span>
                        <span className="text-[10px] font-bold text-neon-green uppercase tracking-wider">Live</span>
                    </div>
                </div>

                {/* Timeframe Toggles */}
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                    {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all duration-300 ${timeframe === tf
                                ? 'bg-neon-cyan/20 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-0 relative z-10">
                {(!data || data.length === 0) ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-xs text-neon-cyan font-mono animate-pulse">Waiting for market data...</span>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="time"
                                hide
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                orientation="right"
                                tick={{ fill: '#6b7280', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => `$${val.toFixed(0)}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="close"
                                stroke="#00f3ff"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
}
