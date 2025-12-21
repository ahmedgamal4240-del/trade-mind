'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown, Plus, Wallet, PieChart, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/lib/AuthProvider'

interface Asset {
    id: number
    symbol: string
    quantity: number
    avg_price: number
    current_price?: number // Mocked for now
}

export default function PortfolioPage() {
    const { session } = useAuth()
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [totalValue, setTotalValue] = useState(0)

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!session?.user) return

            try {
                // 1. Fetch from Supabase
                const { data, error } = await supabase
                    .from('portfolio')
                    .select('*')
                    .eq('user_id', session.user.id)

                if (error) {
                    console.error('Error fetching portfolio:', error)
                    // Fallback to empty if table doesn't exist yet
                    setAssets([])
                } else if (data) {
                    // 2. Enhance with mock current prices (In real app, fetch live from API)
                    const enhancedData = data.map((item: any) => {
                        // Mock price: avg_price +/- 5%
                        const mockCurrent = item.avg_price * (1 + (Math.random() * 0.1 - 0.05))
                        return {
                            ...item,
                            current_price: mockCurrent
                        }
                    })
                    setAssets(enhancedData)

                    // Calculate Total
                    const total = enhancedData.reduce((acc: number, item: Asset) => {
                        return acc + (item.quantity * (item.current_price || item.avg_price))
                    }, 0)
                    setTotalValue(total)
                }
            } catch (err) {
                console.error("Failed to load portfolio", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPortfolio()
    }, [session])

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Portfolio</h1>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Wallet className="w-4 h-4" />
                        <span>Connected Wallet</span>
                        <Badge variant="neutral" className="ml-2 text-[10px]">MAIN ACCOUNT</Badge>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Total Balance</div>
                    <div className="text-4xl font-bold text-white tracking-tight">
                        {loading ? "..." : `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-neon-green text-sm mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+2.4% (Today)</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Asset Allocation Chart (Mock Visual) */}
                <Card className="md:col-span-1 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent" />
                    <PieChart className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Allocation Visualization</p>
                    <div className="mt-4 flex gap-2">
                        {assets.slice(0, 3).map((a, i) => (
                            <div key={a.id} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                                {a.symbol} {Math.round((a.quantity * (a.current_price || 0) / totalValue) * 100) || 0}%
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Holdings List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-white">Holdings</h2>
                        <Button variant="primary" size="sm" glow>
                            <Plus className="w-4 h-4 mr-2" /> Add Asset
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-gray-500 text-center py-10">Loading assets...</div>
                    ) : assets.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <p className="text-gray-400 mb-4">No assets found in your portfolio.</p>
                            <Button variant="outline">Import Transactions</Button>
                        </div>
                    ) : (
                        assets.map((asset) => {
                            const marketValue = asset.quantity * (asset.current_price || asset.avg_price)
                            const gainLoss = (asset.current_price || 0) - asset.avg_price
                            const gainLossPercent = (gainLoss / asset.avg_price) * 100
                            const isPositive = gainLoss >= 0

                            return (
                                <Card key={asset.id} className="flex items-center justify-between p-5 hover:border-neon-cyan/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white group-hover:bg-neon-cyan group-hover:text-black transition-colors">
                                            {asset.symbol[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{asset.symbol}</h3>
                                            <div className="text-xs text-gray-500">{asset.quantity} shares @ ${asset.avg_price}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-white">${marketValue.toLocaleString()}</div>
                                        <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-neon-green' : 'text-neon-red'}`}>
                                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                                        </div>
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
