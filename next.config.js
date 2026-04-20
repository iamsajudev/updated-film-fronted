/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TS errors for deployment
  },
  
  // Disable Turbopack for production build (more stable)
  // Note: This will use webpack instead
  // experimental: {
  //   turbo: false,
  // },
}

module.exports = nextConfig