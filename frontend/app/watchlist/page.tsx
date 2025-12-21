'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Search, Star, MoreHorizontal, ArrowUpRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/lib/AuthProvider'

interface WatchlistItem {
    id: number
    symbol: string
    added_at: string
}

export default function WatchlistPage() {
    const { session } = useAuth()
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!session?.user) return
            setLoading(true)

            try {
                const { data, error } = await supabase
                    .from('watchlist')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('added_at', { ascending: false })

                if (data) {
                    setWatchlist(data)
                }
            } catch (error) {
                console.error("Error fetching watchlist:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchWatchlist()
    }, [session])

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Watchlist</h1>
                    <p className="text-gray-400">Track your favorite assets and potential setups.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Input placeholder="Add symbol..." className="w-64 bg-black/40 border-white/10 pl-9" />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-gray-500 text-center py-10">Syncing watchlist...</div>
                ) : watchlist.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
                        <p className="text-xs text-gray-600">Search for assets to add them here.</p>
                    </div>
                ) : (
                    watchlist.map((item) => (
                        <Card key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4 w-1/4">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">{item.symbol}</div>
                                    <div className="text-xs text-gray-500">Nasdaq</div>
                                </div>
                            </div>

                            {/* Mock Sparkline / Price Data */}
                            <div className="flex-1 px-8">
                                <div className="h-8 w-32 ml-auto opacity-50">
                                    {/* Placeholder for small sparkline chart */}
                                    <svg viewBox="0 0 100 30" width="100%" height="100%" className="overflow-visible">
                                        <path
                                            d="M0 25 Q 20 5, 40 20 T 100 0"
                                            fill="none"
                                            stroke="#00f3ff"
                                            strokeWidth="2"
                                            className="drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-right w-1/4">
                                <div className="font-bold text-white text-lg">$248.50</div>
                                <div className="text-neon-green text-sm font-medium flex items-center justify-end gap-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +1.2%
                                </div>
                            </div>

                            <Button variant="ghost" size="icon" className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
