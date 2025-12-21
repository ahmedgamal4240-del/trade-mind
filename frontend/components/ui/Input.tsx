import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

export function Input({ className, icon, ...props }: InputProps) {
    return (
        <div className="relative group">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                    {icon}
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all duration-300",
                    "focus:border-neon-cyan/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)]",
                    icon && "pl-10",
                    className
                )}
                {...props}
            />
        </div>
    );
}
