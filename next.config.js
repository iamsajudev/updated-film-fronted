/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects/submit-film',
        permanent: true, // Use true for 308 permanent redirect
        basePath: false,
      },
    ];
  },
}

module.exports = nextConfig