import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    glow?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    glow = true,
    children,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-neon-cyan/80 hover:bg-neon-cyan text-black font-semibold border-transparent",
        secondary: "bg-neon-purple/80 hover:bg-neon-purple text-white font-semibold border-transparent",
        outline: "border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan",
        ghost: "hover:bg-white/10 text-gray-300 hover:text-white border-transparent",
        glass: "glass-panel hover:bg-white/10 text-white border-white/10 hover:border-white/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-4 py-2 text-sm rounded-xl",
        lg: "px-6 py-3 text-base rounded-xl",
        icon: "h-10 w-10 p-2 flex items-center justify-center rounded-xl"
    };

    const glowEffects = {
        primary: "shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]",
        secondary: "shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_25px_rgba(157,0,255,0.5)]",
        outline: "hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]",
        ghost: "",
        glass: ""
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center transition-all duration-300 border focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                glow && variant !== 'ghost' && variant !== 'glass' && glowEffects[variant as keyof typeof glowEffects],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
