"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home,
    Share2,
    Briefcase,
    User
} from 'lucide-react';

const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Strategies', icon: Share2, href: '/strategies' },
    { name: 'Portfolio', icon: Briefcase, href: '/portfolio' },
    { name: 'Profile', icon: User, href: '/profile' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[88px] glass-panel border-t border-white/10 rounded-t-[30px] z-50 px-6 pb-6 flex items-center justify-between">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex flex-col items-center justify-center w-16 relative"
                    >
                        {isActive && (
                            <div className="absolute -top-12 w-12 h-1 bg-neon-cyan shadow-[0_0_15px_#00f3ff] rounded-full" />
                        )}
                        <div className={cn(
                            "p-2 rounded-xl transition-all duration-300",
                            isActive ? "text-neon-cyan" : "text-gray-400 hover:text-white"
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-medium mt-1",
                            isActive ? "text-white" : "text-gray-500"
                        )}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
