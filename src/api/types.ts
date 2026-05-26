export interface Track {
  id: number
  name: string
  ar: { id: number; name: string }[]
  al: { id: number; name: string; picUrl: string }
  dt: number
  fee?: number
}

export interface Playlist {
  id: number
  name: string
  coverImgUrl: string
  description: string
  trackCount: number
  playCount: number
  creator: { nickname: string; avatarUrl: string }
  tracks: Track[]
}

export interface Artist {
  id: number
  name: string
  picUrl: string
  albumSize: number
  musicSize: number
  briefDesc: string
}

export interface Album {
  id: number
  name: string
  picUrl: string
  artist: { id: number; name: string }
}

export interface SearchResult {
  songs: Track[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
  songCount: number
  artistCount: number
  albumCount: number
  playlistCount: number
}
