export function fixImg(url: string | undefined | null, size = 300): string {
  if (!url) return ''
  if (url.includes('music.126.net') || url.includes('music.163.com')) {
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}param=${size}y${size}`
  }
  return url
}
