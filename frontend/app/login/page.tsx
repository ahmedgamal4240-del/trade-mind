'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Fingerprint } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else {
            router.push('/')
        }
        setLoading(false)
    }

    const handleSignUp = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-black to-black pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-md p-8 relative z-10 border-white/10 shadow-[0_0_50px_-10px_rgba(157,0,255,0.3)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,243,255,0.5)]">
                        <Fingerprint className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                        TradeMind Access
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Identify yourself to enter the terminal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-bold">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="trader@example.com"
                                className="bg-black/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-bold">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="bg-black/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            glow
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Initialize Session'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleSignUp}
                            disabled={loading}
                        >
                            Create New Identity
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
