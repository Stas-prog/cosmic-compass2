import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <-- тимчасово ігнорує всі ESLint помилки при збірці
  },
};

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // <-- тимчасово ігнорує всі ESLint помилки при збірці
//   },
// };

// module.exports = nextConfig;


export default nextConfig;
