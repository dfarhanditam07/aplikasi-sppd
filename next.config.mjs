/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed custom Webpack rule for .css files
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;