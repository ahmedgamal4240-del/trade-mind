import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PlayCircle, Info } from 'lucide-react';

interface StrategyCardProps {
    title: string;
    description: string;
    sentiment: 'bullish' | 'bearish' | 'neutral' | 'warning' | 'info';
    riskLevel: number; // 1-10
    className?: string;
}

export function StrategyCard({
    title,
    description,
    sentiment,
    riskLevel,
    className
}: StrategyCardProps) {
    return (
        <Card
            className={`${className} group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] hover:border-white/20`}
            gradient={sentiment === 'bullish' ? 'cyan' : 'purple'}
            variant="interactive"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
                <Badge
                    variant={sentiment}
                    className="text-sm px-3 py-1.5 uppercase tracking-wide border-opacity-50"
                >
                    {sentiment}
                </Badge>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight font-mono">
                {title}
            </h3>

            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {description}
            </p>

            <div className="mb-6">
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Risk Level</span>
                    <span className="text-white font-mono">{riskLevel}/10</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <div
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(0,255,157,0.3)] transition-all duration-1000 ease-out bg-gradient-to-r ${riskLevel < 4 ? 'from-neon-green to-neon-cyan' :
                            riskLevel < 7 ? 'from-neon-cyan to-neon-purple' :
                                'from-neon-purple to-neon-red'
                            }`}
                        style={{ width: `${riskLevel * 10}%` }}
                    />
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider font-semibold">
                    {riskLevel < 4 ? 'Low Risk' : riskLevel < 7 ? 'Moderate Risk' : 'High Risk'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full text-xs py-3 md:py-5" glow>
                    <span className="flex items-center gap-2">
                        Copy Trade
                        <PlayCircle className="w-4 h-4" />
                    </span>
                    <span className="block text-[9px] opacity-60 font-normal">(Simulated)</span>
                </Button>
                <Button variant="outline" className="w-full text-xs py-3 md:py-5" glow>
                    Explain Why
                    <Info className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    );
}
