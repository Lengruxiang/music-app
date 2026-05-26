import { Heart } from 'lucide-react'
import type { Track } from '../../api/types'
import { useFavoritesStore } from '../../stores/favorites'

interface Props {
  tracks: Track[]
  onPlay: (track: Track) => void
  showCover?: boolean
  highlightId?: number | null
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function TrackList({ tracks, onPlay, showCover = true, highlightId }: Props) {
  const toggleFav = useFavoritesStore((s) => s.toggle)
  const favTracks = useFavoritesStore((s) => s.tracks)

  if (!tracks || tracks.length === 0) return null

  const filtered = tracks.filter((t) => (t as any).fee !== 1)

  if (filtered.length === 0) return null

  return (
    <div className="w-full">
      {filtered.map((track, i) => {
        const active = highlightId === track.id
        const fav = !!favTracks.find((t: any) => t.id === track.id)
        return (
          <div
            key={track.id}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-md cursor-pointer group transition-colors ${
              active ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => onPlay(track)}
          >
            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm text-gray-400 shrink-0">
              {active ? (
                <span className="inline-block w-3 h-3 bg-red-500 rounded-sm" />
              ) : (
                i + 1
              )}
            </span>
            {showCover && (
              <img
                src={track.al?.picUrl || (track as any).album?.picUrl}
                alt=""
                loading="lazy" className="w-9 sm:w-10 h-9 sm:h-10 rounded object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${active ? 'text-red-500' : ''}`}>
                {track.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {(track.ar || (track as any).artists || [])
                  .map((a: { name: string }) => a.name)
                  .join(' / ')}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFav(track) }}
              className={`shrink-0 p-1 ${
                fav
                  ? 'text-red-500'
                  : 'text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 sm:opacity-0'
              }`}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
            </button>
            <span className="text-xs text-gray-400 shrink-0 hidden sm:group-hover:block">
              {formatTime(track.dt || (track as any).duration || 0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
