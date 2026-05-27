import { useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Loader2,
  AlertCircle,
  X,
  Heart,
} from 'lucide-react'
import { usePlayerStore } from '../../stores/player'
import { useFavoritesStore } from '../../stores/favorites'
import { fixImg } from '../../utils/img'

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    progress,
    duration,
    volume,
    playlist,
    playlistIndex,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    clearError,
  } = usePlayerStore()

  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const previousVolume = useRef(volume)

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration <= 0) return
      const rect = progressRef.current.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      seek(Math.max(0, Math.min(ratio * duration, duration)))
    },
    [duration, seek]
  )

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return
      const rect = volumeRef.current.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      setVolume(Math.max(0, Math.min(ratio, 1)))
    },
    [setVolume]
  )

  const toggleMute = () => {
    if (volume > 0) {
      previousVolume.current = volume
      setVolume(0)
    } else {
      setVolume(previousVolume.current || 0.7)
    }
  }

  const toggleFav = useFavoritesStore((s) => s.toggle)
  const favTracks = useFavoritesStore((s) => s.tracks)

  if (!currentTrack) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        <Music size={18} className="mr-2" />
        <span className="hidden sm:inline">选择一首歌曲开始播放</span>
        <span className="sm:hidden">暂无播放</span>
      </div>
    )
  }

  const artists = (currentTrack.ar || (currentTrack as any).artists || [])
    .map((a: { name: string }) => a.name)
    .join(' / ')

  const coverUrl = fixImg(currentTrack.al?.picUrl || (currentTrack as any).album?.picUrl)

  return (
    <div className="h-full flex items-center px-2 sm:px-4 gap-2 sm:gap-4 relative">
      {/* Error toast */}
      {error && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 whitespace-nowrap shadow-sm z-10 max-w-[calc(100vw-16px)]">
          <AlertCircle size={14} className="shrink-0" />
          <span className="truncate">{error}</span>
          <button onClick={clearError} className="hover:text-red-800 shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Song info - hidden on mobile */}
      <div className="hidden sm:flex items-center gap-3 w-44 lg:w-56 shrink-0">
        <div className="relative">
          <img
            src={coverUrl}
            alt=""
            className={`w-10 lg:w-12 h-10 lg:h-12 rounded-md object-cover shrink-0 ${isLoading ? 'opacity-50' : ''}`}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={20} className="text-red-500 animate-spin" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.name}</p>
          <p className="text-xs text-gray-400 truncate">{artists}</p>
        </div>
        <button
          onClick={() => toggleFav(currentTrack)}
          className={`shrink-0 p-1 ${favTracks.some((t: any) => t.id === currentTrack.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
        >
          <Heart size={18} fill={favTracks.some((t: any) => t.id === currentTrack.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1 mx-auto max-w-xl">
        {/* Progress bar - touch-friendly on mobile, larger hit area */}
        <div className="flex items-center gap-2 w-full text-xs text-gray-400">
          <span className="w-8 sm:w-10 text-right tabular-nums">{formatTime(progress)}</span>
          <div
            ref={progressRef}
            className="flex-1 h-2 sm:h-1.5 bg-gray-200 rounded-full cursor-pointer group relative"
            onClick={handleProgressClick}
          >
            <div
              className={`h-full rounded-full relative transition-all duration-150 ${
                isLoading ? 'bg-red-300' : 'bg-red-500'
              }`}
              style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full sm:opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="w-8 sm:w-10 tabular-nums">{formatTime(duration)}</span>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={prev}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-30 p-1"
            title="上一首"
          >
            <SkipBack size={18} className="fill-gray-500" />
          </button>
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-9 h-9 sm:w-9 sm:h-9 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors disabled:opacity-50"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={18} fill="white" />
            ) : (
              <Play size={18} fill="white" className="ml-0.5" />
            )}
          </button>
          <button
            onClick={next}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-800 transition-colors disabled:opacity-30 p-1"
            title="下一首"
          >
            <SkipForward size={18} className="fill-gray-500" />
          </button>
        </div>
      </div>

      {/* Volume + Playlist info - hidden on mobile, compact on desktop */}
      <div className="hidden sm:flex items-center gap-3 w-44 lg:w-56 shrink-0 justify-end">
        <button onClick={toggleMute} className="text-gray-500 hover:text-gray-800">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div
          ref={volumeRef}
          className="w-16 lg:w-20 h-1.5 bg-gray-200 rounded-full cursor-pointer group"
          onClick={handleVolumeClick}
        >
          <div
            className="h-full bg-gray-500 rounded-full relative"
            style={{ width: `${volume * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {playlist.length > 0 ? `${playlistIndex + 1}/${playlist.length}` : ''}
        </span>
      </div>
    </div>
  )
}
