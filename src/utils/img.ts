/**
 * Resolves an image path to a full URL using baseUrl if needed.
 */
export function resolveImg(
  src: string | null | undefined,
  baseUrl = '/',
): string | null {
  if (!src) return null;
  try {
    new URL(src);
    return src;
  } catch {
    // Relative path handling
  }
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  return `${cleanBase}${cleanSrc}`;
}
