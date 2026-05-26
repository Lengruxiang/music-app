import client from './client'

// 推荐歌单
export function getRecommendPlaylists(limit = 30) {
  return client.get(`/personalized?limit=${limit}`)
}

// 新歌速递
export function getNewSongs(type = 0) {
  return client.get(`/top/song?type=${type}`)
}

// 歌单详情
export function getPlaylistDetail(id: number) {
  return client.get(`/playlist/detail?id=${id}`)
}

// 歌曲 URL
export function getSongUrl(id: number) {
  return client.get(`/song/url?id=${id}&br=320000`)
}

// 歌词
export function getLyric(id: number) {
  return client.get(`/lyric?id=${id}`)
}

// 歌曲详情
export function getSongDetail(ids: number[]) {
  return client.get(`/song/detail?ids=${ids.join(',')}`)
}

// 搜索
export function search(keywords: string, type = 1, limit = 30) {
  return client.get(`/search?keywords=${encodeURIComponent(keywords)}&type=${type}&limit=${limit}`)
}

// 搜索建议
export function getSearchSuggest(keywords: string) {
  return client.get(`/search/suggest?keywords=${encodeURIComponent(keywords)}`)
}

// 排行榜
export function getToplistDetail() {
  return client.get('/toplist/detail')
}

// 歌手详情
export function getArtistDetail(id: number) {
  return client.get(`/artist/detail?id=${id}`)
}

// 歌手热门歌曲
export function getArtistTopSongs(id: number) {
  return client.get(`/artist/top/song?id=${id}`)
}

// 歌手专辑
export function getArtistAlbums(id: number, limit = 20) {
  return client.get(`/artist/album?id=${id}&limit=${limit}`)
}

// 热门歌单分类
export function getHotPlaylistTags() {
  return client.get('/playlist/hot')
}

// 分类歌单
export function getTopPlaylists(cat = '全部', limit = 30) {
  return client.get(`/top/playlist?cat=${encodeURIComponent(cat)}&limit=${limit}`)
}
