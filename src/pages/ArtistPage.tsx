import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArtistDetail, getArtistTopSongs, getArtistAlbums } from '../api/music'
import { usePlayerStore } from '../stores/player'
import TrackList from '../components/common/TrackList'
import type { Track } from '../api/types'

interface ArtistData {
  id: number
  name: string
  picUrl: string
  cover: string
  briefDesc: string
  albumSize: number
  musicSize: number
}

interface AlbumData {
  id: number
  name: string
  picUrl: string
  publishTime: number
}

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [hotSongs, setHotSongs] = useState<Track[]>([])
  const [albums, setAlbums] = useState<AlbumData[]>([])
  const [loading, setLoading] = useState(true)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  useEffect(() => {
    if (!id) return
    async function load() {
      setLoading(true)
      try {
        const [artistRes, songsRes, albumsRes] = await Promise.all([
          getArtistDetail(Number(id)),
          getArtistTopSongs(Number(id)),
          getArtistAlbums(Number(id)),
        ])
        setArtist(artistRes.data?.artist || {})
        setHotSongs(songsRes.songs || [])
        setAlbums(albumsRes.hotAlbums || [])
      } catch (e) {
        console.error('Failed to load artist:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handlePlay = (track: Track) => {
    play(track, hotSongs)
  }

  if (loading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="flex gap-6">
          <div className="w-40 h-40 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pt-8">
            <div className="h-7 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="p-6 text-center text-gray-400 mt-20">
        歌手信息加载失败
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Artist header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
        <img
          src={artist.picUrl || artist.cover}
          alt={artist.name}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg shrink-0"
        />
        <div className="flex flex-col justify-center text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{artist.name}</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            专辑：{artist.albumSize} · 歌曲：{artist.musicSize}
          </p>
          {artist.briefDesc && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-2 max-w-md">
              {artist.briefDesc}
            </p>
          )}
        </div>
      </div>

      {/* Hot songs */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-3">热门歌曲</h3>
        <TrackList
          tracks={hotSongs}
          onPlay={handlePlay}
          showCover={false}
          highlightId={currentTrack?.id ?? null}
        />
      </section>

      {/* Albums */}
      {albums.length > 0 && (
        <section>
          <h3 className="text-lg font-bold mb-3">专辑</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {albums.map((album) => (
              <div key={album.id} className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                <img
                  src={album.picUrl}
                  alt={album.name}
                  className="w-full aspect-square object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium truncate">{album.name}</p>
                {album.publishTime && (
                  <p className="text-xs text-gray-400">
                    {new Date(album.publishTime).getFullYear()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
