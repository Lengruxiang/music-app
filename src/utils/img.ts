/**
 * Append ?param=400y400 to NetEase CDN image URLs for higher resolution.
 */
export function fixImg(url: string | undefined | null): string {
  if (!url) return ''
  if (url.includes('music.126.net') || url.includes('music.163.com')) {
    if (url.includes('?')) {
      return url + '&param=400y400'
    }
    return url + '?param=400y400'
  }
  return url
}
