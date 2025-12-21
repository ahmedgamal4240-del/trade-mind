"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
    return (
        <div className="p-8 pb-20 max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="space-y-6">
                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white">API Keys</h2>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">OpenAI / Gemini Key</label>
                        <Input type="password" placeholder="sk-..." />
                    </div>
                    <Button variant="outline" glow>Save Keys</Button>
                </Card>

                <Card className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Email Alerts</span>
                        <div className="w-10 h-6 bg-neon-green/20 rounded-full relative cursor-pointer border border-neon-green"><div className="absolute right-1 top-1 w-4 h-4 bg-neon-green rounded-full shadow-[0_0_10px_#0f0]" /></div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
