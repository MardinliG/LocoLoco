"use client"

import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
import { Button } from "@/components/ui/button"
import { Menu, X, GlobeIcon, Users, DollarSign, MapPin, Wine } from 'lucide-react'
import { cn } from "@/lib/utils"
import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Cocktail {
    id: number
    name: string
    description: string
    ingredients: string[]
    instructions: string
    country: string
    image_url?: string
}

interface Country {
    ISO_A2?: string
    iso_a2?: string
    NAME?: string
    name?: string
    POP_EST?: number
    pop_est?: number
    GDP_MD_EST?: number
    gdp_md_est?: number
    CONTINENT?: string
    continent?: string
}

interface CountryFeature {
    type: string
    properties: Country
    geometry: any
}

// Mapping des noms de pays
const countryNameMapping: { [key: string]: string } = {
    'Russia': 'Russie',
    'United States': 'États-Unis',
    'USA': 'États-Unis',
    'United Kingdom': 'Royaume-Uni',
    'Brazil': 'Brésil',
    'Mexico': 'Mexique',
    'Spain': 'Espagne',
    'Italy': 'Italie',
    'Japan': 'Japon',
    'Cuba': 'Cuba',
    'Algeria': 'Algérie',
    'France': 'France',
    'Germany': 'Allemagne',
    'China': 'Chine',
    'India': 'Inde',
    'Australia': 'Australie',
    'Canada': 'Canada',
    'South Africa': 'Afrique du Sud',
    'Egypt': 'Égypte',
    'Thailand': 'Thaïlande',
    'Vietnam': 'Vietnam',
    'Greece': 'Grèce',
    'Portugal': 'Portugal',
    'Netherlands': 'Pays-Bas',
    'Belgium': 'Belgique',
    'Switzerland': 'Suisse',
    'Austria': 'Autriche',
    'Sweden': 'Suède',
    'Norway': 'Norvège',
    'Denmark': 'Danemark',
    'Finland': 'Finlande',
    'Poland': 'Pologne',
    'Turkey': 'Turquie',
    'Morocco': 'Maroc',
    'Tunisia': 'Tunisie',
    'Lebanon': 'Liban',
    'Israel': 'Israël',
    'United Arab Emirates': 'Émirats Arabes Unis',
    'Saudi Arabia': 'Arabie Saoudite',
    'Iran': 'Iran',
    'Pakistan': 'Pakistan',
    'Indonesia': 'Indonésie',
    'Malaysia': 'Malaisie',
    'Singapore': 'Singapour',
    'Philippines': 'Philippines',
    'New Zealand': 'Nouvelle-Zélande',
    'Argentina': 'Argentine',
    'Chile': 'Chili',
    'Peru': 'Pérou',
    'Colombia': 'Colombie',
    'Venezuela': 'Venezuela',
    'Uruguay': 'Uruguay',
    'Paraguay': 'Paraguay',
    'Bolivia': 'Bolivie',
    'Ecuador': 'Équateur'
};

// Mapping des noms de pays vers leurs codes ISO
const countryCodeMapping: { [key: string]: string } = {
    // Pays déjà dans la base de données
    'Brazil': 'BR',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES',
    'United States': 'US',
    'USA': 'US',
    'Cuba': 'CU',
    'Jamaica': 'JM',
    'Mexico': 'MX',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Great Britain': 'GB',
    'England': 'GB',
    'Japan': 'JP',

    // Autres pays d'Afrique
    'Mauritania': 'MR',
    'Algeria': 'DZ',
    'Morocco': 'MA',
    'Tunisia': 'TN',
    'Egypt': 'EG',
    'South Africa': 'ZA',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Ethiopia': 'ET',
    'Ghana': 'GH',
    'Senegal': 'SN',
    'Ivory Coast': 'CI',
    'Côte d\'Ivoire': 'CI',
    'Cameroon': 'CM',
    'Democratic Republic of the Congo': 'CD',
    'Congo': 'CG',
    'Angola': 'AO',
    'Mozambique': 'MZ',
    'Madagascar': 'MG',
    'Tanzania': 'TZ',
    'Uganda': 'UG',
    'Rwanda': 'RW',
    'Burundi': 'BI',
    'Zimbabwe': 'ZW',
    'Zambia': 'ZM',
    'Malawi': 'MW',
    'Namibia': 'NA',
    'Botswana': 'BW',
    'Lesotho': 'LS',
    'Swaziland': 'SZ',
    'Eswatini': 'SZ',
    'Somalia': 'SO',
    'Djibouti': 'DJ',
    'Eritrea': 'ER',
    'Sudan': 'SD',
    'South Sudan': 'SS',
    'Chad': 'TD',
    'Niger': 'NE',
    'Mali': 'ML',
    'Burkina Faso': 'BF',
    'Benin': 'BJ',
    'Togo': 'TG',
    'Liberia': 'LR',
    'Sierra Leone': 'SL',
    'Guinea': 'GN',
    'Guinea-Bissau': 'GW',
    'Gambia': 'GM',
    'Cape Verde': 'CV',
    'São Tomé and Príncipe': 'ST',
    'Equatorial Guinea': 'GQ',
    'Gabon': 'GA',
    'Central African Republic': 'CF',
    'Comoros': 'KM',
    'Seychelles': 'SC',
    'Mauritius': 'MU',

    // Pays d'Europe
    'Germany': 'DE',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Poland': 'PL',
    'Ukraine': 'UA',
    'Romania': 'RO',
    'Bulgaria': 'BG',
    'Greece': 'GR',
    'Portugal': 'PT',
    'Ireland': 'IE',
    'Iceland': 'IS',
    'Luxembourg': 'LU',
    'Liechtenstein': 'LI',
    'Malta': 'MT',
    'Cyprus': 'CY',
    'Croatia': 'HR',
    'Slovenia': 'SI',
    'Hungary': 'HU',
    'Slovakia': 'SK',
    'Czech Republic': 'CZ',
    'Czechia': 'CZ',
    'Estonia': 'EE',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Belarus': 'BY',
    'Moldova': 'MD',
    'Albania': 'AL',
    'North Macedonia': 'MK',
    'Montenegro': 'ME',
    'Bosnia and Herzegovina': 'BA',
    'Serbia': 'RS',
    'Kosovo': 'XK',

    // Pays d'Asie
    'China': 'CN',
    'India': 'IN',
    'Indonesia': 'ID',
    'Pakistan': 'PK',
    'Bangladesh': 'BD',
    'Vietnam': 'VN',
    'Thailand': 'TH',
    'Myanmar': 'MM',
    'Cambodia': 'KH',
    'Laos': 'LA',
    'Malaysia': 'MY',
    'Singapore': 'SG',
    'Philippines': 'PH',
    'South Korea': 'KR',
    'North Korea': 'KP',
    'Mongolia': 'MN',
    'Kazakhstan': 'KZ',
    'Uzbekistan': 'UZ',
    'Turkmenistan': 'TM',
    'Kyrgyzstan': 'KG',
    'Tajikistan': 'TJ',
    'Afghanistan': 'AF',
    'Iran': 'IR',
    'Iraq': 'IQ',
    'Syria': 'SY',
    'Lebanon': 'LB',
    'Jordan': 'JO',
    'Israel': 'IL',
    'Palestine': 'PS',
    'Saudi Arabia': 'SA',
    'Yemen': 'YE',
    'Oman': 'OM',
    'United Arab Emirates': 'AE',
    'Qatar': 'QA',
    'Bahrain': 'BH',
    'Kuwait': 'KW',
    'Nepal': 'NP',
    'Bhutan': 'BT',
    'Sri Lanka': 'LK',
    'Maldives': 'MV',
    'Brunei': 'BN',
    'East Timor': 'TL',
    'Timor-Leste': 'TL',

    // Pays d'Amérique
    'Canada': 'CA',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Ecuador': 'EC',
    'Bolivia': 'BO',
    'Paraguay': 'PY',
    'Uruguay': 'UY',
    'Guyana': 'GY',
    'Suriname': 'SR',
    'French Guiana': 'GF',
    'Panama': 'PA',
    'Costa Rica': 'CR',
    'Nicaragua': 'NI',
    'Honduras': 'HN',
    'El Salvador': 'SV',
    'Guatemala': 'GT',
    'Belize': 'BZ',
    'Haiti': 'HT',
    'Dominican Republic': 'DO',
    'Puerto Rico': 'PR',
    'Bahamas': 'BS',
    'Trinidad and Tobago': 'TT',
    'Barbados': 'BB',
    'Saint Lucia': 'LC',
    'Saint Vincent and the Grenadines': 'VC',
    'Grenada': 'GD',
    'Antigua and Barbuda': 'AG',
    'Saint Kitts and Nevis': 'KN',
    'Dominica': 'DM',

    // Pays d'Océanie
    'Australia': 'AU',
    'New Zealand': 'NZ',
    'Papua New Guinea': 'PG',
    'Fiji': 'FJ',
    'Solomon Islands': 'SB',
    'Vanuatu': 'VU',
    'Samoa': 'WS',
    'Tonga': 'TO',
    'Tuvalu': 'TV',
    'Kiribati': 'KI',
    'Marshall Islands': 'MH',
    'Micronesia': 'FM',
    'Palau': 'PW',
    'Nauru': 'NR'
};

export default function Component() {
    const globeEl = useRef<any>()
    const [countries, setCountries] = useState<CountryFeature[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [hoverD, setHoverD] = useState<CountryFeature | null>(null)
    const [isNavOpen, setIsNavOpen] = useState(true)
    const [cocktails, setCocktails] = useState<Cocktail[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then((res) => res.json())
            .then((data) => {
                // Log the first country to see its structure
                console.log('First country in GeoJSON:', data.features[0]);
                setCountries(data.features)
            })
    }, [])

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true
            globeEl.current.controls().autoRotateSpeed = 0.3
            globeEl.current.pointOfView({ altitude: 2.5 })
        }
    }, [])

    const fetchCocktails = async (countryName: string, countryCode: string) => {
        setLoading(true)
        try {
            // Utiliser le code ISO du mapping si disponible
            const mappedCode = countryCodeMapping[countryName] || countryCode;
            console.log('Original country name:', countryName);
            console.log('Mapped country code:', mappedCode);

            // First try to find country by ISO code
            const { data: countryData, error: countryError } = await supabase
                .from('countries')
                .select('id, name, code')
                .eq('code', mappedCode)
                .maybeSingle();

            console.log('Database search result:', { countryData, countryError });

            if (countryError) {
                console.error('Error finding country:', countryError);
                setCocktails([]);
                return;
            }

            if (!countryData) {
                console.log('No country found for code:', mappedCode);
                // Fallback to name search if code doesn't match
                const mappedName = countryNameMapping[countryName] || countryName;
                console.log('Trying name search with:', mappedName);

                const { data: nameMatchData, error: nameMatchError } = await supabase
                    .from('countries')
                    .select('id, name, code')
                    .ilike('name', mappedName)
                    .maybeSingle();

                console.log('Name search result:', { nameMatchData, nameMatchError });

                if (nameMatchError) {
                    console.error('Error in name search:', nameMatchError);
                    setCocktails([]);
                    return;
                }

                if (!nameMatchData) {
                    console.log('No country found even with name search');
                    setCocktails([]);
                    return;
                }

                // Use the name match data
                const { data: cocktailsData, error: cocktailsError } = await supabase
                    .from('cocktails')
                    .select('*')
                    .eq('country_id', nameMatchData.id);

                if (cocktailsError) {
                    console.error('Error fetching cocktails:', cocktailsError);
                    setCocktails([]);
                    return;
                }

                console.log('Found cocktails with name match:', cocktailsData);
                setCocktails(cocktailsData || []);
                return;
            }

            // Use the code match data
            const { data: cocktailsData, error: cocktailsError } = await supabase
                .from('cocktails')
                .select('*')
                .eq('country_id', countryData.id);

            if (cocktailsError) {
                console.error('Error fetching cocktails:', cocktailsError);
                setCocktails([]);
                return;
            }

            console.log('Found cocktails with code match:', cocktailsData);
            setCocktails(cocktailsData || []);

        } catch (error) {
            console.error('Error:', error);
            setCocktails([]);
        } finally {
            setLoading(false);
        }
    }

    const handleCountryClick = async (country: CountryFeature) => {
        if (country && country.properties) {
            console.log('=== COUNTRY PROPERTIES ===');
            console.log('Full properties:', JSON.stringify(country.properties, null, 2));
            // Log all possible ISO code properties
            console.log('ISO_A2:', country.properties.ISO_A2);
            console.log('iso_a2:', country.properties.iso_a2);
            console.log('======================');

            const countryName = country.properties.NAME || country.properties.name || '';
            const countryCode = country.properties.ISO_A2 || country.properties.iso_a2 || '';

            console.log('Selected country name:', countryName);
            console.log('Selected country code:', countryCode);

            const countryData = {
                ISO_A2: countryCode,
                NAME: countryName,
                POP_EST: country.properties.POP_EST || country.properties.pop_est || 0,
                GDP_MD_EST: country.properties.GDP_MD_EST || country.properties.gdp_md_est || 0,
                CONTINENT: country.properties.CONTINENT || country.properties.continent || ''
            };
            setSelectedCountry(countryData);
            setIsNavOpen(true);

            // Fetch cocktails for the selected country using both name and code
            await fetchCocktails(countryName, countryCode);

            try {
                let coords;
                if (country.geometry.type === 'MultiPolygon') {
                    coords = country.geometry.coordinates[0][0][0];
                } else {
                    coords = country.geometry.coordinates[0][0];
                }

                if (coords && coords.length >= 2) {
                    globeEl.current?.pointOfView(
                        {
                            lat: coords[1],
                            lng: coords[0],
                            altitude: 1.5,
                        },
                        1000
                    );
                }
            } catch (error) {
                console.error('Error handling coordinates:', error);
                globeEl.current?.pointOfView(
                    {
                        lat: 0,
                        lng: 0,
                        altitude: 2.5,
                    },
                    1000
                );
            }
        }
    }

    const getCountryColor = (country: CountryFeature) => {
        const continent = country.properties?.CONTINENT || ''
        const colors: { [key: string]: string } = {
            Africa: "rgba(148, 163, 184, 0.9)",
            Asia: "rgba(100, 116, 139, 0.9)",
            Europe: "rgba(71, 85, 105, 0.9)",
            "North America": "rgba(51, 65, 85, 0.9)",
            "South America": "rgba(30, 41, 59, 0.9)",
            Oceania: "rgba(15, 23, 42, 0.9)",
            Antarctica: "rgba(203, 213, 225, 0.9)",
        }

        return colors[continent] || "rgba(148, 163, 184, 0.8)"
    }

    const formatNumber = (num: number | undefined) => {
        if (!num) return "N/A"
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"
        return num.toString()
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
            {/* Globe */}
            <Globe
                ref={globeEl}
                globeImageUrl="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4="
                backgroundColor="rgba(255, 255, 255, 0.95)"
                atmosphereColor="rgba(255, 255, 255, 0)"
                atmosphereAltitude={0}
                polygonsData={countries}
                polygonAltitude={(d: any) => (d === hoverD ? 0.08 : 0.02)}
                polygonCapColor={(d: any) => (d === hoverD ? "rgba(59, 130, 246, 0.9)" : getCountryColor(d))}
                polygonSideColor={() => "rgba(148, 163, 184, 0.3)"}
                polygonStrokeColor={() => "rgba(255, 255, 255, 0.8)"}
                onPolygonHover={(polygon: object | null) => setHoverD(polygon as CountryFeature | null)}
                onPolygonClick={(polygon: object, event: MouseEvent, coords: { lat: number; lng: number; altitude: number }) => {
                    handleCountryClick(polygon as CountryFeature)
                }}
                polygonsTransitionDuration={200}
                width={typeof window !== "undefined" ? window.innerWidth : 1200}
                height={typeof window !== "undefined" ? window.innerHeight : 800}
            />

            {/* Overlay for closing sidebar */}
            {isNavOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
                    onClick={() => setIsNavOpen(false)}
                />
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className={cn(
                    "fixed top-6 left-72 z-50 bg-white/90 backdrop-blur-md border border-slate-300/50 hover:bg-slate-50/90 text-slate-700 shadow-lg transition-all duration-300",
                    !isNavOpen && "left-6"
                )}
            >
                {isNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 transition-all duration-300 z-40 shadow-xl overflow-y-auto",
                    isNavOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <GlobeIcon className="h-6 w-6 text-slate-600" />
                        <h1 className="text-xl font-semibold text-slate-800">Globe Explorer</h1>
                    </div>

                    {/* Country Info */}
                    {(selectedCountry || hoverD?.properties) ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    {selectedCountry?.NAME || hoverD?.properties.NAME}
                                </h2>
                                <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                                    {selectedCountry?.ISO_A2 || hoverD?.properties.ISO_A2}
                                </div>
                            </div>

                            {selectedCountry && (
                                <>
                                    {/* Cocktails Section */}
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            <Wine className="h-5 w-5 text-slate-600" />
                                            Cocktails Traditionnels
                                        </h3>

                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                                            </div>
                                        ) : cocktails.length > 0 ? (
                                            <div className="space-y-4">
                                                {cocktails.map((cocktail) => (
                                                    <div key={cocktail.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                        <h4 className="font-semibold text-slate-800 mb-2">{cocktail.name}</h4>
                                                        <p className="text-sm text-slate-600 mb-2">{cocktail.description}</p>
                                                        <div className="text-xs text-slate-500">
                                                            <p className="font-medium mb-1">Ingrédients:</p>
                                                            <ul className="list-disc list-inside">
                                                                {cocktail.ingredients.map((ingredient, index) => (
                                                                    <li key={index}>{ingredient}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-slate-500">
                                                Aucun cocktail trouvé pour ce pays
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <GlobeIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-sm">Survolez ou cliquez sur un pays</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
