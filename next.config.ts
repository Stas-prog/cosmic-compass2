import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <-- тимчасово ігнорує всі ESLint помилки при збірці
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true, // <-- тимчасово ігнорує всі ESLint помилки при збірці
//   },
// };

// module.exports = nextConfig;