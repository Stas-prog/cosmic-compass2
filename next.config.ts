import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    })
    return config
  },
  turbopack: {}

};



export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // <-- тимчасово ігнорує всі ESLint помилки при збірці
//   },
// };

// module.exports = nextConfig;