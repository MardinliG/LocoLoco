'use client'

import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import { useSupabase } from '@/lib/supabase-provider'
import AddCocktailForm from './AddCocktailForm'

type Country = Database['public']['Tables']['countries']['Row']
type Cocktail = Database['public']['Tables']['cocktails']['Row']

export default function GlobeComponent() {
    const globeRef = useRef<any>()
    const { user } = useSupabase()
    const [countries, setCountries] = useState<Country[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [cocktails, setCocktails] = useState<Cocktail[]>([])
    const [showAddForm, setShowAddForm] = useState(false)

    useEffect(() => {
        // Load countries data
        const loadCountries = async () => {
            const { data } = await supabase
                .from('countries')
                .select('*')
                .order('name')
            if (data) setCountries(data)
        }
        loadCountries()
    }, [])

    useEffect(() => {
        if (globeRef.current) {
            // Auto-rotate
            globeRef.current.controls().autoRotate = true
            globeRef.current.controls().autoRotateSpeed = 0.5
            // Set initial zoom
            globeRef.current.pointOfView({ altitude: 2.5 })
        }
    }, [])

    const handleCountryClick = async (country: Country) => {
        setSelectedCountry(country)
        setShowAddForm(false)
        // Load cocktails for the selected country
        const { data } = await supabase
            .from('cocktails')
            .select('*')
            .eq('country_id', country.id)
        if (data) setCocktails(data)
    }

    const handleAddSuccess = async () => {
        if (selectedCountry) {
            const { data } = await supabase
                .from('cocktails')
                .select('*')
                .eq('country_id', selectedCountry.id)
            if (data) setCocktails(data)
        }
        setShowAddForm(false)
    }

    return (
        <div className="relative h-[calc(100vh-4rem)]">
            <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                hexPolygonsData={countries}
                hexPolygonResolution={3}
                hexPolygonMargin={0.3}
                hexPolygonColor={() => '#1e40af'}
                onHexPolygonClick={handleCountryClick}
            />

            {/* Sidebar for selected country */}
            {selectedCountry && (
                <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{selectedCountry.name}</h2>
                        {user && (
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="text-sm text-primary-600 hover:text-primary-800"
                            >
                                {showAddForm ? 'Annuler' : '+ Ajouter un cocktail'}
                            </button>
                        )}
                    </div>

                    {showAddForm ? (
                        <AddCocktailForm
                            countryId={selectedCountry.id}
                            onSuccess={handleAddSuccess}
                        />
                    ) : (
                        <>
                            {cocktails.length > 0 ? (
                                <div className="space-y-4">
                                    {cocktails.map((cocktail) => (
                                        <div
                                            key={cocktail.id}
                                            className="p-4 bg-gray-50 rounded-lg"
                                        >
                                            <h3 className="font-semibold">{cocktail.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {cocktail.description}
                                            </p>
                                            <div className="mt-2">
                                                <h4 className="text-sm font-medium">Ingrédients :</h4>
                                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                                    {cocktail.ingredients.map((ingredient, index) => (
                                                        <li key={index}>{ingredient}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="mt-2">
                                                <h4 className="text-sm font-medium">Instructions :</h4>
                                                <p className="text-sm text-gray-600">{cocktail.instructions}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Aucun cocktail enregistré pour ce pays</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
} 