'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { SupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase'

type SupabaseContext = {
    supabase: SupabaseClient<Database>
    user: User | null
    session: any | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [supabase] = useState(() => createClientComponentClient<Database>())
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<any | null>(null)
    const router = useRouter()

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            router.refresh()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, router])

    return (
        <Context.Provider value={{ supabase, user, session }}>
            {children}
        </Context.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider')
    }
    return context
} 