import Link from 'next/link'

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-white">
            <div className="text-center space-y-8 max-w-2xl">
                <h1 className="text-5xl font-bold text-primary-900">
                    Lococktail
                </h1>
                <p className="text-xl text-gray-600">
                    L&apos;encyclopédie interactive des cocktails
                </p>
                <div className="space-y-4">
                    <Link
                        href="/world"
                        className="btn-primary inline-block"
                    >
                        Explorer
                    </Link>
                </div>
            </div>
        </main>
    )
} 