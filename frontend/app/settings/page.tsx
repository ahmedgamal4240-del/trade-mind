"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/AuthProvider";
import { User, Shield, Bell, Key, CreditCard, ChevronRight, Monitor, LogOut } from "lucide-react";

export default function SettingsPage() {
    const { session, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "account", label: "Account Security", icon: Shield },
        { id: "api", label: "API Keys", icon: Key },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "billing", label: "Subscription", icon: CreditCard },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account preferences and integrations</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-neon-cyan" : ""}`} />
                                <span className="font-medium">{tab.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-neon-cyan" />}
                            </button>
                        );
                    })}

                    <div className="pt-8 mt-8 border-t border-white/10">
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neon-red hover:bg-neon-red/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {activeTab === "profile" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card className="p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-3xl font-bold text-black shadow-lg">
                                            {session?.user?.email?.[0].toUpperCase() || "T"}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">Trader Profile</h2>
                                            <p className="text-gray-400 mb-4">{session?.user?.email}</p>
                                            <Badge variant="bullish">Pro Plan Active</Badge>
                                        </div>
                                    </div>
                                    <Button variant="outline">Edit Profile</Button>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Display Name</label>
                                        <Input defaultValue="Pro Trader" className="bg-black/20" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                                        <Input defaultValue={session?.user?.email || ""} disabled className="bg-white/5 text-gray-400" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "api" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-neon-cyan/20 text-neon-cyan">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">API Configuration</h3>
                                        <p className="text-sm text-gray-400">Manage keys for external data providers</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">OpenAI / Gemini API Key</label>
                                        <div className="flex gap-2">
                                            <Input type="password" value="sk-........................" className="font-mono text-sm tracking-widest" readOnly />
                                            <Button variant="secondary">Update</Button>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2">Used for AI strategy generation and chat analysis.</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Alpha Vantage Key (Optional)</label>
                                        <div className="flex gap-2">
                                            <Input type="text" placeholder="Enter key..." />
                                            <Button variant="secondary">Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === "notifications" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card className="p-0 overflow-hidden divide-y divide-white/5">
                                {[
                                    { title: "Price Alerts", desc: "Get notified when assets hit target prices" },
                                    { title: "AI Strategy Signals", desc: "Receive alerts for new high-confidence signals" },
                                    { title: "Market News", desc: "Daily digest of top market moving news" }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                                        </div>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
