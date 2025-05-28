import dynamic from 'next/dynamic'

const GlobeComponent = dynamic(() => import('@/components/Globe'), {
    ssr: false,
    loading: () => <div>Chargement du globe...</div>
})

export default function WorldPage() {
    return (
        <div className="container mx-auto px-4">
            <GlobeComponent />
        </div>
    )
} 