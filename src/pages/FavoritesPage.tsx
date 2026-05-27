import { Heart } from 'lucide-react'
import { useFavoritesStore } from '../stores/favorites'
import { usePlayerStore } from '../stores/player'
import TrackList from '../components/common/TrackList'
import type { Track } from '../api/types'

export default function FavoritesPage() {
  const tracks = useFavoritesStore((s) => s.tracks)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  const handlePlay = (track: Track) => {
    play(track, tracks)
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={20} className="text-[#ff4757]" fill="#ff4757" />
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">我的收藏</h2>
        <span className="text-xs text-[#6b7280]">{tracks.length} 首</span>
      </div>

      {tracks.length > 0 ? (
        <TrackList
          tracks={tracks}
          onPlay={handlePlay}
          showCover
          highlightId={currentTrack?.id ?? null}
        />
      ) : (
        <div className="text-center text-[#6b7280] mt-20">
          <Heart size={48} className="mx-auto mb-4 opacity-10" />
          <p>还没有收藏歌曲</p>
          <p className="text-xs mt-1">在歌曲列表中点击 <Heart size={14} className="inline" fill="#ff4757" /> 即可收藏</p>
        </div>
      )}
    </div>
  )
}
