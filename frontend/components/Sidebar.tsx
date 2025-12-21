"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Briefcase,
    LineChart,
    Radio,
    History,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { useSidebar } from '@/lib/SidebarContext';

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Portfolio', icon: Briefcase, href: '/portfolio' },
    { name: 'Watchlist', icon: LineChart, href: '/watchlist' },
    { name: 'AI Signals', icon: Radio, href: '/signals' },
    { name: 'History', icon: History, href: '/history' },
    { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isOpen, close } = useSidebar();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-[280px] border-r border-white/5 bg-black/95 backdrop-blur-xl z-50 p-6 flex flex-col transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                            <Menu className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                            TradeMind
                        </h1>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={close} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={close} // Close on nav click (mobile)
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-neon-cyan/20 to-transparent text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan shadow-[0_0_10px_#00f3ff]" />
                                )}
                                <Icon className={cn("w-5 h-5", isActive ? "text-neon-cyan" : "group-hover:text-neon-cyan/80")} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-4 py-6 border-t border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-4">Recent Searches</div>
                    <div className="space-y-3">
                        {['TSLA', 'NVDA', 'BTC/USD'].map((ticker) => (
                            <div key={ticker} className="flex items-center justify-between text-sm text-gray-400 hover:text-white cursor-pointer group">
                                <span>{ticker}</span>
                                <span className="text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
}
