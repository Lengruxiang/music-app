import type { Track } from '../../api/types'

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
  if (!tracks || tracks.length === 0) return null

  return (
    <div className="w-full">
      {tracks.map((track, i) => {
        const isActive = highlightId === track.id
        return (
          <div
            key={track.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer group transition-colors ${
              isActive ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => onPlay(track)}
          >
            <span className="w-8 text-center text-sm text-gray-400 shrink-0">
              {isActive ? (
                <span className="inline-block w-3 h-3 bg-red-500 rounded-sm" />
              ) : (
                i + 1
              )}
            </span>
            {showCover && (
              <img
                src={track.al?.picUrl || (track as any).album?.picUrl}
                alt=""
                className="w-10 h-10 rounded object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${isActive ? 'text-red-500' : ''}`}>
                {track.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {(track.ar || (track as any).artists || [])
                  .map((a: { name: string }) => a.name)
                  .join(' / ')}
              </p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 hidden group-hover:block">
              {(track as any).fee === 1 ? (
                <span className="text-orange-400">试听</span>
              ) : (
                formatTime(track.dt || (track as any).duration || 0)
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
