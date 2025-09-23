export function GET(): Response {
  const securityTxt = `Contact: security@premiumstore.com
Contact: https://your-domain.com/security-contact
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Encryption: https://your-domain.com/pgp-key.txt
Acknowledgments: https://your-domain.com/security-acknowledgments
Preferred-Languages: en
Canonical: https://your-domain.com/.well-known/security.txt
Policy: https://your-domain.com/security-policy`

  return new Response(securityTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
