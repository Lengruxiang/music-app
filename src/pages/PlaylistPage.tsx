import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import { getPlaylistDetail } from '../api/music'
import { usePlayerStore } from '../stores/player'
import TrackList from '../components/common/TrackList'
import type { Track } from '../api/types'
import { fixImg } from '../utils/img'

interface PlaylistData {
  id: number
  name: string
  coverImgUrl: string
  description: string
  trackCount: number
  playCount: number
  creator: { nickname: string; avatarUrl: string }
}

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [allTracks, setAllTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  useEffect(() => {
    if (!id) return
    async function load() {
      setLoading(true)
      try {
        const res = await getPlaylistDetail(Number(id))
        const pl = res.playlist || {}
        setPlaylist(pl)
        const rawTracks = pl.tracks || []
        // Filter out trial songs (fee=1)
        const playable = rawTracks.filter((t: any) => [0, 8].includes(t.fee))
        setAllTracks(playable)
        setTracks(playable.slice(0, 50))
      } catch (e) {
        console.error('Failed to load playlist:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const playAll = () => {
    if (tracks.length > 0) {
      play(tracks[0], allTracks)
    }
  }

  const handlePlay = (track: Track) => {
    play(track, allTracks)
  }

  if (loading) {
    return (
      <div className="p-3 sm:p-6 animate-pulse space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 rounded-xl shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="p-6 text-center text-gray-400 mt-20">
        歌单不存在或加载失败
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header - stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        <img
          src={fixImg(playlist.coverImgUrl)}
          alt={playlist.name}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover shadow-lg shrink-0 mx-auto sm:mx-0"
        />
        <div className="flex flex-col justify-end min-w-0 text-center sm:text-left">
          <p className="text-xs text-gray-400 mb-1 sm:mb-2">歌单</p>
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 truncate">{playlist.name}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 sm:mb-3 justify-center sm:justify-start">
            <img
              src={fixImg(playlist.creator?.avatarUrl)}
              alt=""
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
            />
            <span>{playlist.creator?.nickname}</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            歌曲数：{allTracks.length} · 播放量：{(playlist.playCount / 10000).toFixed(1)}万
          </p>
          <button
            onClick={playAll}
            className="mt-3 sm:mt-4 bg-red-500 hover:bg-red-600 text-white px-5 sm:px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors mx-auto sm:mx-0 self-center sm:self-start"
          >
            <Play size={18} fill="white" /> 播放全部
          </button>
        </div>
      </div>

      {/* Track list */}
      <TrackList
        tracks={tracks}
        onPlay={handlePlay}
        showCover={false}
        highlightId={currentTrack?.id ?? null}
      />
    </div>
  )
}
