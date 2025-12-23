"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, AreaSeries } from 'lightweight-charts';
import { Card } from './ui/Card';

export function LiveChart({ data, ticker }: { data: any[], ticker: string }) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Using Candlestick or Area? Backend returns OHLC.
        // Let's use Candlestick for better trading feel, or Area for "simple" look. 
        // User asked for "sync live with market chart". Candlestick is more "trader".
        // But let's stick to Area for now as it looks "cleaner" for the dashboard unless requested otherwise, 
        // OR switch to Candlestick if data supports it. 
        // The previous code was Area. Let's keep Area for simple "Movement" visualization, 
        // but map OHLC to Line/Area (using Close).

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: '#00f3ff',
            topColor: 'rgba(0, 243, 255, 0.2)',
            bottomColor: 'rgba(0, 243, 255, 0.0)',
            lineWidth: 2,
        });

        seriesRef.current = areaSeries;
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update data when it changes
    useEffect(() => {
        if (seriesRef.current && data) {
            console.log("LiveChart received data:", data.length, "items", data[0]);
            if (data.length > 0) {
                // Map API data to Chart data
                // API: { time, open, high, low, close }
                // Area Series expects: { time, value }
                const chartData = data.map(d => ({
                    time: d.time,
                    value: d.close
                }));

                // Lightweight charts needs sorted unique data. 
                // Assuming API returns sorted.
                seriesRef.current.setData(chartData);

                // Fit content if it's the first load or significantly different?
                // chartRef.current?.timeScale().fitContent(); 
            }
        }
    }, [data]);

    const [timeframe, setTimeframe] = React.useState('1D');

    // ... (rest of the component)

    return (
        <Card className="p-6 h-[400px] flex flex-col relative overflow-hidden group">
            {/* Glossy background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

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
            {(!data || data.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs text-neon-cyan font-mono animate-pulse">Waiting for market data...</span>
                    </div>
                </div>
            )}
            <div ref={chartContainerRef} className="w-full flex-1 min-h-0" />
        </Card>
    );
}
