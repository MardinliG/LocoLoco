import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const limit = parseInt(searchParams.get('limit') || '10')
        const page = parseInt(searchParams.get('page') || '1')
        const offset = (page - 1) * limit

        const supabase = createRouteHandlerClient({ cookies })

        let query = supabase
            .from('countries')
            .select('*', { count: 'exact' })

        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        const { data, error, count } = await query
            .order('name')
            .range(offset, offset + limit - 1)

        if (error) throw error

        return NextResponse.json({
            countries: data,
            total: count,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        })
    } catch (error) {
        console.error('Error fetching countries:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des pays' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            )
        }

        // Vérifier si l'utilisateur est admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { name, code } = body

        // Validation des données
        if (!name || !code) {
            return NextResponse.json(
                { error: 'Le nom et le code du pays sont requis' },
                { status: 400 }
            )
        }

        // Vérifier si le pays existe déjà
        const { data: existingCountry } = await supabase
            .from('countries')
            .select('id')
            .or(`name.eq.${name},code.eq.${code}`)
            .single()

        if (existingCountry) {
            return NextResponse.json(
                { error: 'Un pays avec ce nom ou ce code existe déjà' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('countries')
            .insert({
                name,
                code
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating country:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la création du pays' },
            { status: 500 }
        )
    }
} 