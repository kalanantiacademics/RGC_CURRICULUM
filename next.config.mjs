/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // Wajib untuk GitHub Pages
  basePath: "/RGC_CURRICULUM",
  assetPrefix: "/RGC_CURRICULUM/",
  trailingSlash: true,
  images: {
    unoptimized: true, // Wajib jika nanti menggunakan komponen <Image /> Next.js
  },
};

export default nextConfig;
