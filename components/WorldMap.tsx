'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useSupabase } from '@/lib/supabase-provider'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type Cocktail = {
    id: string
    name: string
    description: string
    image_url: string | null
}

type Country = {
    name: string
    cocktails: Cocktail[]
}

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function WorldMap() {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({ coordinates: [0, 0], zoom: 1 })

    function handleZoomIn() {
        if (position.zoom >= 4) return
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }))
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }))
    }

    function handleMoveEnd(position: any) {
        setPosition(position)
    }

    const handleCountryClick = async (countryName: string) => {
        setIsLoading(true)
        try {
            const { data: cocktails, error } = await supabase
                .from('cocktails')
                .select(`
                    id,
                    name,
                    description,
                    image_url,
                    countries (
                        name
                    )
                `)
                .eq('countries.name', countryName)

            if (error) throw error

            setSelectedCountry({
                name: countryName,
                cocktails: cocktails || []
            })
        } catch (error) {
            console.error('Error fetching cocktails:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                    -
                </button>
            </div>

            <ComposableMap
                projection="geoOrthographic"
                projectionConfig={{
                    scale: 300
                }}
            >
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleCountryClick(geo.properties.name)}
                                    style={{
                                        default: {
                                            fill: "#D6D6DA",
                                            outline: "none",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 0.5,
                                        },
                                        hover: {
                                            fill: "#F53",
                                            outline: "none",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 0.5,
                                        },
                                        pressed: {
                                            fill: "#E42",
                                            outline: "none",
                                            stroke: "#FFFFFF",
                                            strokeWidth: 0.5,
                                        },
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            <AnimatePresence>
                {selectedCountry && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="absolute top-0 right-0 w-96 h-full bg-white shadow-lg p-4 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{selectedCountry.name}</h2>
                            <button
                                onClick={() => setSelectedCountry(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedCountry.cocktails.length === 0 ? (
                                    <p className="text-gray-500">Aucun cocktail trouvé pour ce pays.</p>
                                ) : (
                                    selectedCountry.cocktails.map((cocktail) => (
                                        <div
                                            key={cocktail.id}
                                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                                        >
                                            {cocktail.image_url && (
                                                <img
                                                    src={cocktail.image_url}
                                                    alt={cocktail.name}
                                                    className="w-full h-32 object-cover rounded-lg mb-2"
                                                />
                                            )}
                                            <h3 className="font-semibold">{cocktail.name}</h3>
                                            <p className="text-sm text-gray-600">{cocktail.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 