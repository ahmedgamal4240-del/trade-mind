'use client';

import React, { useState, useRef } from 'react';
import { BrainCircuit, Activity, AlertTriangle, TrendingUp, Camera, Send, Image as ImageIcon, Bot, Sparkles, RefreshCw, Mic } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';

interface AnalysisData {
    'Detected Pattern': string;
    'Strategy': string;
    'Entry Price': string;
    'Stop Loss': string;
    'Risk Level': string;
}

interface Message {
    id?: string;
    role: 'ai' | 'user' | 'assistant';
    content: string;
    image?: string | null;
    analysis?: AnalysisData;
}

interface ChatProps {
    ticker?: string;
}

export default function ChatInterface({ ticker = "General" }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: `Hello! I am your TradeMind consultant. I'm analyzing ${ticker}. Upload a chart or ask me a question.` }
    ]);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('Chat Mode'); // Chat Mode | Vision Mode
    const [strategyMode, setStrategyMode] = useState('General Analysis');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const strategies = [
        { name: 'General Analysis', icon: BrainCircuit, color: 'text-neon-cyan' },
        { name: 'Trap Detector', icon: AlertTriangle, color: 'text-yellow-400' },
        { name: 'Elliott Wave', icon: TrendingUp, color: 'text-blue-400' },
        { name: 'Wyckoff Method', icon: Activity, color: 'text-purple-400' },
        { name: 'Harmonic Patterns', icon: BrainCircuit, color: 'text-pink-400' },
        { name: 'Momentum Scalp', icon: TrendingUp, color: 'text-neon-green' },
    ];

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognition.start();
        } else {
            alert("Voice input not supported in this browser.");
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMode('Vision Mode');
        }
    };

    const handleSend = async () => {
        if (!input && !selectedImage) return;

        setLoading(true);
        const userMsg: Message = {
            id: uuidv4(),
            role: 'user',
            content: input,
            image: previewUrl
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        try {
            // Real API Call
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    image_url: previewUrl, // Note: In a real app we'd upload this file first and send the URL. For now we assume previewUrl is local or we need to handle file upload logic differently if it's a blob.
                    ticker: ticker
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            const aiMsg: Message = {
                id: uuidv4(),
                role: 'ai',
                content: data.response
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: uuidv4(),
                role: 'assistant', // System message
                content: "I'm having trouble reaching the server. Please check your connection."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] md:h-[650px] relative overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(157,0,255,0.1)]">
                        <Bot className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white tracking-tight">AI Consultant</h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Gemini 1.5 Pro</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="hover:bg-white/10 text-gray-400 hover:text-white">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-in fade-in duration-700">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 flex items-center justify-center animate-pulse-slow">
                            <Sparkles className="w-10 h-10 text-neon-cyan" />
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <h3 className="text-lg font-bold text-white">How can I help you trade?</h3>
                            <p className="text-sm text-gray-400">Select a strategy below to start your analysis or just type your question.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id || Math.random()}
                        className={cn(
                            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-sm border relative overflow-hidden group transition-all",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10 border-neon-purple/20 text-white rounded-br-none shadow-[0_4px_20px_rgba(157,0,255,0.1)]"
                                    : "bg-white/5 border-white/5 text-gray-200 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                            )}
                        >
                            {/* Shiny border effect for user messages */}
                            {msg.role === 'user' && (
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                            )}

                            {(msg.role === 'ai' || msg.role === 'assistant') && (
                                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-neon-cyan opacity-80">
                                    <Bot className="w-3 h-3" /> TradeMind AI
                                </div>
                            )}

                            {msg.image && (
                                <div className="mb-3 rounded-lg overflow-hidden border border-white/10 shadow-md">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={msg.image} alt="Upload" className="w-full object-cover max-h-48" />
                                </div>
                            )}

                            <div className="prose prose-invert prose-sm max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white/5 border border-white/10 text-gray-400 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
                {/* Visualizer Modes */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mask-fade-right mb-2">
                    {strategies.map((s) => {
                        const Icon = s.icon;
                        const isActive = strategyMode === s.name;
                        return (
                            <button
                                key={s.name}
                                onClick={() => setStrategyMode(s.name)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap",
                                    isActive
                                        ? `bg-white/10 border-${s.color.split('-')[1] === 'neon' ? s.color.split('-')[2] : s.color.split('-')[1] || 'white'}/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                                        : "bg-transparent border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
                                )}
                            >
                                <Icon className={cn("w-3 h-3", isActive ? s.color : "grayscale opacity-50")} />
                                {s.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-3 items-center bg-white/5 p-2 rounded-2xl border border-white/5 focus-within:border-neon-cyan/30 focus-within:bg-white/10 transition-all shadow-inner">
                    {mode === 'Vision Mode' && (
                        <>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
                            >
                                <ImageIcon size={20} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </>
                    )}

                    <div className="relative flex-1">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder={isListening ? "Listening..." : `Ask about ${strategyMode}...`}
                            className={cn(
                                "pr-10 bg-transparent border-none focus:ring-0 focus:shadow-none px-0 text-sm placeholder:text-gray-600 h-auto py-2",
                                isListening && "placeholder:text-neon-red animate-pulse"
                            )}
                        />
                        <button
                            onClick={startListening}
                            className={cn(
                                "absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                                isListening
                                    ? "text-neon-red"
                                    : "text-gray-600 hover:text-white"
                            )}
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={(!input && !selectedImage) || loading}
                        variant="primary"
                        className="w-10 h-10 rounded-xl p-0 shrink-0 shadow-lg shadow-neon-cyan/20"
                        glow
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
