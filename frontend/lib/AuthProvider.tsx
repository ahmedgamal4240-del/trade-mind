'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useRouter, usePathname } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
    session: Session | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
            if (!session && pathname !== '/login') {
                router.push('/login')
            }
        })

        return () => subscription.unsubscribe()
    }, [pathname, router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    // Protected routes check
    useEffect(() => {
        if (!loading && !session && pathname !== '/login') {
            router.push('/login')
        }
    }, [loading, session, pathname, router])

    return (
        <AuthContext.Provider value={{ session, loading, signOut }}>
            {!loading ? children : (
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                        <p className="text-neon-cyan font-mono text-sm animate-pulse">INITIALIZING SECURE LINK...</p>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
