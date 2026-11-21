/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["sql.js"],
  async rewrites() {
    return [{ source: "/", destination: "/index.html" }];
  }
};
export default nextConfig;
