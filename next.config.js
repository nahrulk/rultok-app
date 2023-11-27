/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handel canvas binary module
    config.module.rules.push({ test: /\.node$/, use: "raw-loader" });

    // exclude canvas from being proccessed by Next.js in the browser

    if (!isServer) config.externals.push("canvas");
    return config;
  },
};

module.exports = nextConfig;
