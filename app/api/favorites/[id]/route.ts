import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            )
        }

        const { data, error } = await supabase
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
            `)
            .eq('id', params.id)
            .eq('user_id', session.user.id)
            .single()

        if (error) throw error

        if (!data) {
            return NextResponse.json(
                { error: 'Favori non trouvé' },
                { status: 404 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching favorite:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du favori' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            )
        }

        // Vérifier si le favori appartient à l'utilisateur
        const { data: favorite } = await supabase
            .from('favorites')
            .select('id')
            .eq('id', params.id)
            .eq('user_id', session.user.id)
            .single()

        if (!favorite) {
            return NextResponse.json(
                { error: 'Favori non trouvé' },
                { status: 404 }
            )
        }

        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting favorite:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du favori' },
            { status: 500 }
        )
    }
} 