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
        <Card className="flex flex-col h-[600px] relative overflow-hidden border-neon-cyan/20">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-neon-purple/20 p-2 rounded-lg">
                        <Bot className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">AI Consultant</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                            <span className="text-xs text-gray-400">Online • Gemini 1.5 Pro</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
                    <RefreshCw className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 opacity-50">
                        <Sparkles className="w-12 h-12 text-neon-cyan/50" />
                        <p className="text-sm">Select a strategy below or ask me anything.</p>
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
                                "max-w-[85%] rounded-2xl p-4 shadow-lg backdrop-blur-sm border",
                                msg.role === 'user'
                                    ? "bg-neon-cyan/10 border-neon-cyan/20 text-white rounded-br-none"
                                    : "bg-white/5 border-white/10 text-gray-200 rounded-bl-none"
                            )}
                        >
                            {(msg.role === 'ai' || msg.role === 'assistant') && (
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neon-purple opacity-80">
                                    <Bot className="w-3 h-3" /> TradeMind AI
                                </div>
                            )}

                            {msg.image && (
                                <div className="mb-3 rounded-xl overflow-hidden border border-white/20 shadow-lg">
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
            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
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
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                                    isActive
                                        ? `bg-white/10 border-${s.color.split('-')[1] || 'white'} text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                                        : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-3 h-3", isActive ? s.color : "text-gray-500")} />
                                {s.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 items-center">
                    {mode === 'Vision Mode' && (
                        <>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-gray-400 hover:text-neon-cyan hover:bg-white/5 rounded-xl transition-colors"
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
                                "pr-10",
                                isListening && "border-neon-red shadow-[0_0_10px_rgba(255,0,0,0.5)] placeholder:text-neon-red"
                            )}
                        />
                        <button
                            onClick={startListening}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                                isListening
                                    ? "text-neon-red bg-neon-red/10 animate-pulse"
                                    : "text-gray-400 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                    </div>
                    <Button
                        onClick={handleSend}
                        disabled={(!input && !selectedImage) || loading}
                        variant="primary"
                        className="px-4"
                        glow
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
