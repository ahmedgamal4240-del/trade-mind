import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists, usually does in shadcn/modern stacks. If not I will create it.

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glow' | 'interactive';
    gradient?: 'none' | 'cyan' | 'purple';
}

export function Card({
    className,
    variant = 'default',
    gradient = 'none',
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "glass-panel rounded-2xl p-6 transition-all duration-300",
                variant === 'interactive' && "glass-panel-hover cursor-pointer",
                gradient === 'cyan' && "bg-gradient-to-br from-white/5 to-neon-cyan/5",
                gradient === 'purple' && "bg-gradient-to-br from-white/5 to-neon-purple/5",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
