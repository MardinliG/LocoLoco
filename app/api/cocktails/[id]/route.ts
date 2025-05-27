import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createRouteHandlerClient({ cookies })

        const { data, error } = await supabase
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
            `)
            .eq('id', params.id)
            .single()

        if (error) throw error

        if (!data) {
            return NextResponse.json(
                { error: 'Cocktail non trouvé' },
                { status: 404 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching cocktail:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du cocktail' },
            { status: 500 }
        )
    }
}

export async function PUT(
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

        // Vérifier si l'utilisateur est admin ou le créateur du cocktail
        const { data: cocktail } = await supabase
            .from('cocktails')
            .select('created_by')
            .eq('id', params.id)
            .single()

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile?.is_admin && cocktail?.created_by !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
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
            .update({
                name,
                description,
                ingredients,
                instructions,
                country_id,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error updating cocktail:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du cocktail' },
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

        // Vérifier si l'utilisateur est admin ou le créateur du cocktail
        const { data: cocktail } = await supabase
            .from('cocktails')
            .select('created_by')
            .eq('id', params.id)
            .single()

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile?.is_admin && cocktail?.created_by !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            )
        }

        const { error } = await supabase
            .from('cocktails')
            .delete()
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting cocktail:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du cocktail' },
            { status: 500 }
        )
    }
} 