import React, { useEffect, useState } from 'react';

const defaultNewsItems = [
    { source: 'BREAKING', text: 'Market data initializing...', url: '#' },
    { source: 'SYSTEM', text: 'Connecting to global feed...', url: '#' },
];

interface NewsItem {
    source: string;
    text: string;
    url: string;
}

export function NewsTicker() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>(defaultNewsItems);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/market-data/general`);
                const data = await res.json();

                if (data.news && data.news.length > 0) {
                    const formattedNews = data.news.map((item: any) => ({
                        source: item.source || 'MARKET',
                        text: item.title,
                        url: item.url
                    }));
                    setNewsItems(formattedNews);
                }
            } catch (error) {
                console.error("Failed to fetch news ticker:", error);
            }
        };

        fetchNews();
        // Poll every 60 seconds
        const interval = setInterval(fetchNews, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-10 bg-black border-t border-white/10 flex items-center overflow-hidden relative shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black to-transparent z-10" />

            <div className="flex items-center gap-3 px-6 z-20 shrink-0 h-full bg-black border-r border-white/10">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                <span className="text-neon-cyan font-mono font-bold tracking-widest text-[10px] uppercase">MARKET TERMINAL</span>
            </div>

            <div className={`flex whitespace-nowrap animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] items-center ${newsItems.length <= 2 ? '' : ''}`}>
                {[...newsItems, ...newsItems].map((item, index) => (
                    <div key={index}
                        className="flex items-center gap-3 mx-8 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => window.open(item.url, '_blank')}
                    >
                        <span className="text-neon-purple font-mono font-bold text-[10px] uppercase tracking-wider">[{item.source}]</span>
                        <span className="text-gray-300 text-xs font-medium">{item.text}</span>
                        <span className="text-white/20 text-[10px]">///</span>
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
