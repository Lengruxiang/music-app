import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaylistCard from '../components/common/PlaylistCard'
import TrackList from '../components/common/TrackList'
import { getRecommendPlaylists, getNewSongs } from '../api/music'
import { usePlayerStore } from '../stores/player'
import type { Track } from '../api/types'

interface SimplePlaylist {
  id: number
  name: string
  picUrl: string
  playCount: number
  coverImgUrl: string
}

export default function DiscoverPage() {
  const [playlists, setPlaylists] = useState<SimplePlaylist[]>([])
  const [newSongs, setNewSongs] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [plRes, songRes] = await Promise.all([
          getRecommendPlaylists(20),
          getNewSongs(0),
        ])
        setPlaylists(plRes.result || [])
        setNewSongs(songRes.data || [])
      } catch (e) {
        console.error('Failed to load discover page:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handlePlay = (track: Track) => {
    play(track, newSongs)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Banner Area */}
      <div className="bg-gradient-to-r from-red-500 to-pink-400 rounded-xl p-4 sm:p-8 text-white">
        <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">发现音乐</h2>
        <p className="text-white/80 text-xs sm:text-sm">探索你喜欢的音乐，发现新的旋律</p>
      </div>

      {/* 推荐歌单 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">推荐歌单</h3>
          <button
            onClick={() => navigate('/search?q=')}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            查看更多
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl as any} />
          ))}
        </div>
      </section>

      {/* 新歌速递 */}
      <section>
        <h3 className="text-lg font-bold mb-4">新歌速递</h3>
        <TrackList
          tracks={newSongs}
          onPlay={handlePlay}
          highlightId={currentTrack?.id ?? null}
        />
      </section>
    </div>
  )
}
