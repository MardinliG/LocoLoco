import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protected routes that require authentication
    const protectedRoutes = ['/profile', '/favorites', '/admin']
    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    )

    // If the route is protected and there's no session, redirect to login
    if (isProtectedRoute && !session) {
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and tries to access login/signup, redirect to home
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res
}

export const config = {
    matcher: ['/profile/:path*', '/favorites/:path*', '/admin/:path*', '/login', '/signup'],
} 