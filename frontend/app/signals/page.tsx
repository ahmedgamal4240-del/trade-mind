"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SignalsPage() {
    return (
        <div className="p-8 pb-20">
            <h1 className="text-3xl font-bold text-white mb-8">AI Signals</h1>
            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="grid grid-cols-4 text-xs uppercase text-gray-400 font-bold tracking-wider">
                        <div>Ticker</div>
                        <div>Signal</div>
                        <div>Strategy</div>
                        <div className="text-right">Time</div>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {[
                        { t: "TSLA", s: "Strong Buy", st: "Momentum Breakout", tm: "2m ago" },
                        { t: "BTC", s: "Buy", st: "Golden Cross", tm: "15m ago" },
                        { t: "AMD", s: "Sell", st: "RSI Overbought", tm: "1h ago" },
                        { t: "NVDA", s: "Hold", st: "Consolidation", tm: "3h ago" },
                    ].map((sig, i) => (
                        <div key={i} className="p-6 grid grid-cols-4 items-center hover:bg-white/5 transition-colors">
                            <div className="font-bold text-white">{sig.t}</div>
                            <div><Badge variant={sig.s.includes('Buy') ? 'bullish' : (sig.s.includes('Sell') ? 'bearish' : 'neutral')}>{sig.s}</Badge></div>
                            <div className="text-sm text-gray-300">{sig.st}</div>
                            <div className="text-right text-xs text-gray-500">{sig.tm}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
