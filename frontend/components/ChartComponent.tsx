'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface ChartProps {
    data: CandleData[];
    ticker: string;
}

export default function ChartComponent({ data, ticker }: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // We need refs for the chart and the series
    const chartInstance = useRef<IChartApi | null>(null);
    const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#111827' },
                textColor: '#D1D5DB',
            },
            grid: {
                vertLines: { color: '#374151' },
                horzLines: { color: '#374151' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        chartInstance.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        seriesInstance.current = candlestickSeries;

        // Set initial data if available
        if (data && data.length > 0) {
            candlestickSeries.setData(data);
        }

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length === 0 || entries[0].target !== chartContainerRef.current) { return; }
            const newRect = entries[0].contentRect;
            chart.applyOptions({ width: newRect.width });
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            chart.remove();
            chartInstance.current = null;
            seriesInstance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (seriesInstance.current && data && data.length > 0) {
            seriesInstance.current.setData(data);
        }
    }, [data]);

    return (
        <div className="w-full h-full p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-2">{ticker} Price Architecture</h2>
            <div ref={chartContainerRef} className="w-full h-[500px]" />
        </div>
    );
}
