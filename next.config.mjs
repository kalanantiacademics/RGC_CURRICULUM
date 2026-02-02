/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // Wajib untuk GitHub Pages
  images: {
    unoptimized: true, // Wajib jika nanti menggunakan komponen <Image /> Next.js
  },
};

export default nextConfig;