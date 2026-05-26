import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaylistCard from '../components/common/PlaylistCard'
import TrackList from '../components/common/TrackList'
import { getTopPlaylists, getNewSongs } from '../api/music'
import { usePlayerStore } from '../stores/player'
import type { Track } from '../api/types'

interface SimplePlaylist {
  id: number
  name: string
  coverImgUrl: string
  playCount: number
  trackCount: number
}

export default function DiscoverPage() {
  const [cantoneseList, setCantoneseList] = useState<SimplePlaylist[]>([])
  const [hotPlaylists, setHotPlaylists] = useState<SimplePlaylist[]>([])
  const [newSongs, setNewSongs] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [cantoneseRes, hotRes, songRes] = await Promise.all([
          getTopPlaylists('粤语', 30),
          getTopPlaylists('华语', 30),
          getNewSongs(0),
        ])

        setCantoneseList(
          (cantoneseRes.playlists || []).filter((p: any) => p.trackCount >= 50)
        )
        setHotPlaylists(
          (hotRes.playlists || []).filter((p: any) => p.trackCount >= 50)
        )
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
      <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
        {[1, 2].map((section) => (
          <div key={section} className="animate-pulse space-y-4">
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
        ))}
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-400 rounded-xl p-4 sm:p-8 text-white">
        <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">发现音乐</h2>
        <p className="text-white/80 text-xs sm:text-sm">探索你喜欢的音乐，发现新的旋律</p>
      </div>

      {/* 粤语歌单 */}
      {cantoneseList.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold">
              🎤 粤语歌单
              <span className="text-xs text-gray-400 font-normal ml-2">50首以上</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {cantoneseList.slice(0, 10).map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      {/* 华语热门歌单 */}
      {hotPlaylists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold">
              华语精选
              <span className="text-xs text-gray-400 font-normal ml-2">50首以上</span>
            </h3>
            <button
              onClick={() => navigate('/search?q=粤语')}
              className="text-xs sm:text-sm text-gray-400 hover:text-red-500"
            >
              更多
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {hotPlaylists.slice(0, 10).map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      {/* 新歌速递 */}
      <section>
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">新歌速递</h3>
        <TrackList
          tracks={newSongs}
          onPlay={handlePlay}
          highlightId={currentTrack?.id ?? null}
        />
      </section>
    </div>
  )
}
