"use client";

import { Card } from "@/components/ui/Card";

export default function HistoryPage() {
    return (
        <div className="p-8 pb-20">
            <h1 className="text-3xl font-bold text-white mb-8">Analysis History</h1>
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Card className="p-8 text-center max-w-md">
                    <h3 className="text-white font-bold mb-2">No History Yet</h3>
                    <p className="text-sm">Your past AI analysis conversations and chart scans will appear here.</p>
                </Card>
            </div>
        </div>
    );
}
