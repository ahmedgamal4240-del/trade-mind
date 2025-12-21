import React from 'react';

const newsItems = [
    { source: 'BREAKING', text: 'TSLA announces new AI-driven production line...' },
    { source: 'GLOBAL MARKETS', text: 'Tech stocks surge amid AI adoption...' },
    { source: 'TRADEMIND AI', text: 'New feature launch next week...' },
    { source: 'CRYPTO', text: 'Bitcoin surges past $60k...' },
    { source: 'ECONOMIC DATA', text: 'Inflation cooling...' },
];

export function NewsTicker() {
    return (
        <div className="w-full h-12 glass-panel border-t border-white/10 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

            <div className="flex items-center gap-2 px-4 z-20 shrink-0">
                <span className="text-neon-cyan font-bold tracking-wider text-xs">NEWS TICKER</span>
                <div className="h-4 w-[1px] bg-white/20" />
            </div>

            <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused]">
                {[...newsItems, ...newsItems].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mx-6">
                        <span className="text-white font-bold text-xs">{item.source}:</span>
                        <span className="text-gray-300 text-xs">{item.text}</span>
                        <span className="text-neon-cyan">•</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}
