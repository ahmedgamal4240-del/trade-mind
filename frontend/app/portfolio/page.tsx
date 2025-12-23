'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown, Plus, Wallet, PieChart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePortfolio, Position } from '@/hooks/usePortfolio'
import { useRouter } from 'next/navigation'

export default function PortfolioPage() {
    const { portfolio, balance, getPortfolioValue } = usePortfolio()
    const [totalValue, setTotalValue] = useState(0)
    const router = useRouter()

    useEffect(() => {
        // Calculate total value based on average price (since we don't have live price for all assets yet)
        // In a real app, we'd fetch the current price for each symbol in the portfolio
        const assetsValue = getPortfolioValue({});
        setTotalValue(balance + assetsValue)
    }, [portfolio, balance, getPortfolioValue])

    return (
        <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md gap-4 md:gap-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Paper Portfolio</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Wallet className="w-4 h-4" />
                        <span>Simulated Account</span>
                        <Badge variant="neutral" className="ml-2 text-[10px]">DEMO</Badge>
                    </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                    <div className="text-sm text-gray-400 mb-1">Total Equity</div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center justify-start md:justify-end gap-1 text-neon-cyan text-sm mt-1">
                        <span>Cash Balance: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Asset Allocation Chart (Mock Visual) */}
                <Card className="md:col-span-1 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-black/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent" />
                    {portfolio.length > 0 ? (
                        <>
                            <PieChart className="w-16 h-16 text-neon-cyan mb-4 opacity-80" />
                            <p className="text-white font-medium mb-2">Asset Allocation</p>
                            <div className="flex flex-wrap justify-center gap-2 px-4">
                                {portfolio.map((p, i) => (
                                    <div key={p.symbol} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                                        {p.symbol}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center p-6">
                            <PieChart className="w-16 h-16 text-gray-700 mb-4" />
                            <p className="text-gray-500">No assets allocated</p>
                        </div>
                    )}
                </Card>

                {/* Holdings List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-white">Holdings</h2>
                        <Button variant="primary" size="sm" glow onClick={() => router.push('/')}>
                            <Plus className="w-4 h-4 mr-2" /> New Trade
                        </Button>
                    </div>

                    {portfolio.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <p className="text-gray-400 mb-4">You haven't made any trades yet.</p>
                            <Button variant="outline" onClick={() => router.push('/')}>Start Trading</Button>
                        </div>
                    ) : (
                        portfolio.map((asset) => {
                            // Calculates simplified values since we don't have live cache of all prices here yet
                            // Ideally we would fetch live prices for the portfolio list
                            const marketValue = asset.quantity * asset.avgPrice;

                            return (
                                <Card key={asset.symbol} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 hover:border-neon-cyan/30 transition-all group gap-4 md:gap-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center font-bold text-white border border-white/10 group-hover:border-neon-cyan/50 transition-colors shadow-lg">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white">{asset.symbol}</h3>
                                            <div className="text-xs text-gray-500 font-mono tracking-wide">{asset.quantity} shares @ ${asset.avgPrice.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="text-left md:text-right w-full md:w-auto p-3 md:p-0 bg-white/5 md:bg-transparent rounded-lg">
                                        <div className="text-xs text-gray-400 mb-1">Total Value</div>
                                        <div className="font-bold text-white text-lg">${marketValue.toLocaleString()}</div>
                                    </div>
                                </Card>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
