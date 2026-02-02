const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0F172A"/>
  <circle cx="32" cy="32" r="18" fill="#F9C013"/>
</svg>`;

export function GET() {
  return new Response(svgIcon, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
