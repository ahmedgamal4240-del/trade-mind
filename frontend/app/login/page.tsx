'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Fingerprint, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const [isLoginMode, setIsLoginMode] = useState(true) // Toggle between Login and Signup
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false) // Toggle password visibility
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        console.log("Attempting auth...", { isLoginMode, email }) // Debug log

        try {
            if (isLoginMode) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                console.log("Login success:", data)
                router.push('/')
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/`,
                    },
                })
                if (error) throw error
                console.log("Signup success:", data)
                // If auto-confirm is on, we might be logged in already
                if (data.session) {
                    router.push('/')
                } else {
                    setMessage({ type: 'success', text: 'Registration successful! Please check your email.' })
                }
            }
        } catch (error: any) {
            console.error("Auth error:", error)
            setMessage({
                type: 'error',
                text: error.message || 'An unexpected error occurred. Check console for details.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-black to-black pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

            <Card className="w-full max-w-md p-8 relative z-10 border-white/10 shadow-[0_0_50px_-10px_rgba(157,0,255,0.2)] bg-black/60 backdrop-blur-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-pulse-slow">
                        <Fingerprint className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                        {isLoginMode ? 'Welcome Back' : 'Join TradeMind'}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 text-center">
                        {isLoginMode
                            ? 'Enter your credentials to access the terminal'
                            : 'Create a secure identity to start trading'}
                    </p>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm text-center mb-6 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-neon-red/10 text-neon-red border border-neon-red/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="pl-10 bg-white/5 border-white/10 focus:border-neon-cyan transition-colors"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-neon-purple transition-colors" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="pl-10 pr-10 bg-white/5 border-white/10 focus:border-neon-purple transition-colors"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-2 group relative overflow-hidden"
                        glow
                        disabled={loading}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : (isLoginMode ? 'Access Terminal' : 'Create Account')}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </span>
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-gray-400">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode)
                            setMessage(null)
                        }}
                        className="text-neon-cyan hover:text-white text-sm font-semibold mt-2 transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                        {isLoginMode ? 'Initialize New Identity' : 'Return to Login'}
                    </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-gray-600">
                    <p>Debug Config:</p>
                    <p>Debug Config:</p>
                    <p className="font-mono text-[10px] break-all">
                        URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 20) + '...' : 'MISSING'}
                    </p>
                    <p className="font-mono text-[10px]">
                        Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'MISSING'}
                    </p>
                </div>
            </Card>
        </div>
    )
}
