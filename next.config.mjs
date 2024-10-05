/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // React Strict Mode 비활성화
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
