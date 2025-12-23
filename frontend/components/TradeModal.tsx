'use client';

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'buy' | 'sell';
    symbol: string;
    price: number;
    onConfirm: (quantity: number) => void;
}

export function TradeModal({ isOpen, onClose, type, symbol, price, onConfirm }: TradeModalProps) {
    const [quantity, setQuantity] = useState<string>('1');
    const [total, setTotal] = useState<number>(price);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const qty = parseFloat(quantity) || 0;
        setTotal(qty * price);
    }, [quantity, price]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        onConfirm(parseFloat(quantity));
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-full max-w-md relative overflow-hidden bg-black/90 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Background Glow */}
                <div className={`absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br ${type === 'buy' ? 'from-neon-green/30 to-transparent' : 'from-neon-red/30 to-transparent'}`} />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10">
                    <div>
                        <Badge variant={type === 'buy' ? 'bullish' : 'bearish'} className="mb-2">
                            {type === 'buy' ? 'LONG POSITION' : 'SHORT POSITION'}
                        </Badge>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {type === 'buy' ? "Buy" : "Sell"} {symbol}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 relative z-10">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-gray-400 text-sm">Current Price</span>
                        <span className="text-xl font-mono font-bold text-white">${price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 block">Quantity</label>
                        <div className="relative">
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="pl-10 text-lg font-mono"
                                autoFocus
                            />
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <span className="text-gray-400">Estimated Total</span>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-mono">
                                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <span className="text-xs text-gray-500">Available Balance: $50,000.00</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 relative z-10">
                    <Button
                        className={`w-full py-6 text-lg font-bold shadow-lg transition-all active:scale-[0.98] ${type === 'buy'
                                ? 'bg-neon-green text-black hover:bg-neon-green/90 shadow-neon-green/20'
                                : 'bg-neon-red text-white hover:bg-neon-red/90 shadow-neon-red/20'
                            }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {type === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                Confirm {type === 'buy' ? 'Purchase' : 'Sale'}
                            </span>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
