/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimisations pour le développement
    webpack: (config, { dev, isServer }) => {
        // Optimisations pour le développement
        if (dev && !isServer) {
            config.watchOptions = {
                poll: 1000, // Vérifie les changements toutes les secondes
                aggregateTimeout: 300, // Délai avant de recompiler
            }
        }
        return config
    },
    // Désactive la vérification TypeScript pendant le développement
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === 'development',
    },
    // Désactive la vérification ESLint pendant le développement
    eslint: {
        ignoreDuringBuilds: process.env.NODE_ENV === 'development',
    },
}

module.exports = nextConfig 