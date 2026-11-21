
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg"],
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html"
      }
    ];
  }
};

export default nextConfig;
