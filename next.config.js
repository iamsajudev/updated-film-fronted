/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Remove reactCompiler for production stability
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // Output as standalone for better deployment
    output: 'standalone',
    // Environment variables for production
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://server.nybff.us',
    },
};

module.exports = nextConfig;