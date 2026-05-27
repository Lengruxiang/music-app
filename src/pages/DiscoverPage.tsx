import { useEffect, useState } from 'react'
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

  useEffect(() => {
    async function load() {
      try {
        const [cantoneseRes, hotRes, songRes] = await Promise.all([
          getTopPlaylists('粤语', 50),
          getTopPlaylists('华语', 50),
          getNewSongs(0),
        ])

        setCantoneseList(
          (cantoneseRes.playlists || [])
            .filter((p: any) => p.trackCount >= 80)
            .sort((a: any, b: any) => b.playCount - a.playCount)
        )
        setHotPlaylists(
          (hotRes.playlists || [])
            .filter((p: any) => p.trackCount >= 80)
            .sort((a: any, b: any) => b.playCount - a.playCount)
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
            <div className="h-6 w-24 bg-[#1e1e1e] rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-square bg-[#1e1e1e] rounded-lg mb-2" />
                  <div className="h-4 bg-[#1e1e1e] rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 space-y-8 sm:space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d1b69] via-[#1a1a3e] to-[#0d1117] p-6 sm:p-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-white">发现音乐</h2>
          <p className="text-sm sm:text-base text-[#9ca3af] max-w-md">探索你喜欢的音乐，发现无限可能</p>
        </div>
      </div>

      {/* 粤语歌单 */}
      {cantoneseList.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">粤语歌单</h3>
            <span className="text-xs text-[#6b7280]">{cantoneseList.length} 个歌单</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {cantoneseList.slice(0, 12).map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      {/* 华语精选 */}
      {hotPlaylists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">华语精选</h3>
            <span className="text-xs text-[#6b7280]">{hotPlaylists.length} 个歌单</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {hotPlaylists.slice(0, 12).map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      {/* 新歌速递 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">新歌速递</h3>
        </div>
        <TrackList
          tracks={newSongs}
          onPlay={handlePlay}
          highlightId={currentTrack?.id ?? null}
        />
      </section>
    </div>
  )
}
