import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const countryId = searchParams.get('country_id')
        const search = searchParams.get('search')
        const limit = parseInt(searchParams.get('limit') || '10')
        const page = parseInt(searchParams.get('page') || '1')
        const offset = (page - 1) * limit

        const supabase = createRouteHandlerClient({ cookies })

        let query = supabase
            .from('cocktails')
            .select(`
                *,
                countries (
                    id,
                    name
                ),
                profiles (
                    username
                )
            `, { count: 'exact' })

        if (countryId) {
            query = query.eq('country_id', countryId)
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) throw error

        return NextResponse.json({
            cocktails: data,
            total: count,
            page,
            totalPages: Math.ceil((count || 0) / limit)
        })
    } catch (error) {
        console.error('Error fetching cocktails:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des cocktails' },
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

        const body = await request.json()
        const { name, description, ingredients, instructions, country_id } = body

        // Validation des données
        if (!name || !description || !ingredients || !instructions || !country_id) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('cocktails')
            .insert({
                name,
                description,
                ingredients,
                instructions,
                country_id,
                created_by: session.user.id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating cocktail:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la création du cocktail' },
            { status: 500 }
        )
    }
} 