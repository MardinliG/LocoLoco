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
            .from('countries')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) throw error

        if (!data) {
            return NextResponse.json(
                { error: 'Pays non trouvé' },
                { status: 404 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching country:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la récupération du pays' },
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

        // Vérifier si le pays existe déjà (sauf pour le pays actuel)
        const { data: existingCountry } = await supabase
            .from('countries')
            .select('id')
            .or(`name.eq.${name},code.eq.${code}`)
            .neq('id', params.id)
            .single()

        if (existingCountry) {
            return NextResponse.json(
                { error: 'Un pays avec ce nom ou ce code existe déjà' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('countries')
            .update({
                name,
                code
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error updating country:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour du pays' },
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

        // Vérifier si le pays a des cocktails associés
        const { data: cocktails } = await supabase
            .from('cocktails')
            .select('id')
            .eq('country_id', params.id)
            .limit(1)

        if (cocktails && cocktails.length > 0) {
            return NextResponse.json(
                { error: 'Impossible de supprimer un pays qui a des cocktails associés' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('countries')
            .delete()
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting country:', error)
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du pays' },
            { status: 500 }
        )
    }
} 