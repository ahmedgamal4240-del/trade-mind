import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'bullish' | 'bearish' | 'neutral' | 'warning' | 'info';
    icon?: boolean;
}

export function Badge({
    className,
    variant = 'neutral',
    icon = true,
    children,
    ...props
}: BadgeProps) {
    const styles = {
        bullish: "bg-neon-green/10 text-neon-green border-neon-green/30",
        bearish: "bg-neon-pink/10 text-neon-pink border-neon-pink/30",
        neutral: "bg-gray-500/10 text-gray-400 border-gray-500/30",
        warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        info: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
    };

    const IconMap = {
        bullish: TrendingUp,
        bearish: TrendingDown,
        neutral: Info,
        warning: AlertCircle,
        info: Info
    };

    const IconComponent = IconMap[variant];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent backdrop-blur-md",
                styles[variant],
                className
            )}
            {...props}
        >
            {icon && <IconComponent className="w-3.5 h-3.5" />}
            {children}
        </div>
    );
}
