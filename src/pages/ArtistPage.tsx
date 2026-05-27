import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArtistDetail, getArtistTopSongs } from '../api/music'
import { usePlayerStore } from '../stores/player'
import TrackList from '../components/common/TrackList'
import type { Track } from '../api/types'
import { fixImg } from '../utils/img'

interface ArtistData {
  id: number
  name: string
  picUrl: string
  cover: string
  briefDesc: string
  albumSize: number
  musicSize: number
}

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>()
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [hotSongs, setHotSongs] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  useEffect(() => {
    if (!id) return
    async function load() {
      setLoading(true)
      try {
        const [artistRes, songsRes] = await Promise.all([
          getArtistDetail(Number(id)),
          getArtistTopSongs(Number(id)),
        ])
        setArtist(artistRes.data?.artist || {})
        setHotSongs(songsRes.songs || [])
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
      <div className="p-3 sm:p-6 animate-pulse space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-32 sm:w-40 h-32 sm:h-40 bg-[#1e1e1e] rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pt-8">
            <div className="h-7 bg-[#1e1e1e] rounded w-1/3" />
            <div className="h-4 bg-[#1e1e1e] rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-[#1e1e1e] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="p-3 sm:p-6 text-center text-[#6b7280] mt-20">
        歌手信息加载失败
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
        <img
          src={fixImg(artist.picUrl || artist.cover, 400)}
          alt={artist.name}
          loading="lazy"
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-2xl shadow-black/40 shrink-0 ring-4 ring-[#1e1e1e]"
        />
        <div className="flex flex-col justify-center text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-white">{artist.name}</h2>
          <p className="text-xs sm:text-sm text-[#9ca3af]">
            歌曲：{artist.musicSize}
          </p>
          {artist.briefDesc && (
            <p className="text-xs sm:text-sm text-[#6b7280] mt-1 sm:mt-2 line-clamp-2 max-w-md">
              {artist.briefDesc}
            </p>
          )}
        </div>
      </div>

      <section>
        <h3 className="text-lg font-bold mb-3 text-white">热门歌曲</h3>
        <TrackList
          tracks={hotSongs}
          onPlay={handlePlay}
          showCover={false}
          highlightId={currentTrack?.id ?? null}
        />
      </section>
    </div>
  )
}
