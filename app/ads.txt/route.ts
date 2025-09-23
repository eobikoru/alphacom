export function GET(): Response {
  const adsTxt = `# Premium Store - Authorized Digital Sellers
# Updated: ${new Date().toISOString()}

# Google AdSense
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0

# Add your advertising partners here
# Format: domain, publisher_id, relationship, certification_authority_id`

  return new Response(adsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
