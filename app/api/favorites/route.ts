import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit

        const { data, error, count } = await supabase
            .from('favorites')
            .select(`
                *,
                cocktails (
                    id,
                    name,
                    description,
                    ingredients,
                    instructions,
                    country_id,
                    countries (
                        id,
                        name,
                        code
                    )
                )
            `, { count: 'exact' })
            .eq('user_id', session.user.id)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({
            data,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des favoris' },
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
        const { cocktail_id } = body

        if (!cocktail_id) {
            return NextResponse.json(
                { error: 'L\'ID du cocktail est requis' },
                { status: 400 }
            )
        }

        // Vérifier si le cocktail existe
        const { data: cocktail } = await supabase
            .from('cocktails')
            .select('id')
            .eq('id', cocktail_id)
            .single()

        if (!cocktail) {
            return NextResponse.json(
                { error: 'Cocktail non trouvé' },
                { status: 404 }
            )
        }

        // Vérifier si le favori existe déjà
        const { data: existingFavorite } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('cocktail_id', cocktail_id)
            .single()

        if (existingFavorite) {
            return NextResponse.json(
                { error: 'Ce cocktail est déjà dans vos favoris' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('favorites')
            .insert({
                user_id: session.user.id,
                cocktail_id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error adding favorite:', error)
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout du favori' },
            { status: 500 }
        )
    }
} 