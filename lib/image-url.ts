const CLOUDINARY_UPLOAD = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/

/**
 * Returns a Cloudinary URL resized to `width` (never upscaled) and served in the
 * best format/quality for the browser. Non-Cloudinary URLs are returned unchanged.
 */
export function cdnImage<T extends string | null | undefined>(src: T, width: number): T {
  if (!src) return src
  const match = src.match(CLOUDINARY_UPLOAD)
  if (!match) return src
  const [, base, rest] = match
  // Only the version segment (v123…) or the public id may follow /upload/ for an untransformed URL.
  if (!/^v\d+\//.test(rest) && rest.includes(",")) return src
  return `${base}f_auto,q_auto,c_limit,w_${width}/${rest}` as T
}
