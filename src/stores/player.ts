import { create } from 'zustand'
import type { Track } from '../api/types'

interface PlayerState {
  currentTrack: Track | null
  playlist: Track[]
  playlistIndex: number
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  volume: number
  progress: number
  duration: number

  play: (track: Track, playlist?: Track[]) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
  setProgress: (p: number) => void
  seek: (p: number) => void
  pause: () => void
  clearError: () => void
}

let audio: HTMLAudioElement | null = null

function getAudio() {
  if (!audio) {
    audio = new Audio()
    audio.volume = 0.7
    audio.preload = 'auto'
  }
  return audio
}

function proxyUrl(url: string) {
  const base = import.meta.env.DEV ? '' : '/api'
  return `${base}/audio-proxy?url=${encodeURIComponent(url)}`
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  playlist: [],
  playlistIndex: -1,
  isPlaying: false,
  isLoading: false,
  error: null,
  volume: 0.7,
  progress: 0,
  duration: 0,

  play: async (track, playlist) => {
    const a = getAudio()
    const state = get()

    if (state.currentTrack?.id === track.id) {
      if (state.isLoading) return
      if (state.isPlaying) {
        a.pause()
      } else {
        a.play().catch(() => {})
      }
      return
    }

    a.pause()
    set({
      currentTrack: track,
      isPlaying: false,
      isLoading: true,
      error: null,
      progress: 0,
      duration: 0,
    })

    if (playlist) {
      const idx = playlist.findIndex((t) => t.id === track.id)
      set({ playlist, playlistIndex: idx })
    }

    try {
      const res = await fetch(`/api/song/url?id=${track.id}&br=320000`)
      const data = await res.json()
      const item = data.data?.[0]
      const url = item?.url
      const fee = item?.fee ?? 0
      const songTime = item?.time ?? 0

      if (!url) {
        if (fee > 0) {
          set({ error: '该歌曲需要会员才能播放', isLoading: false })
        } else {
          set({ error: '暂无可用音源', isLoading: false })
        }
        return
      }

      // fee=1 songs are 30s previews, skip them
      if (fee === 1 || (fee > 0 && songTime > 0 && songTime < 60000)) {
        set({ error: '该歌曲仅提供试听片段，已自动跳过', isLoading: false })
        // Auto-skip to next song after a short delay
        setTimeout(() => {
          const s = get()
          if (s.currentTrack?.id === track.id) {
            s.next()
          }
        }, 1500)
        return
      }

      a.src = proxyUrl(url)
      await a.play()
    } catch (e: any) {
      console.error('Failed to get song URL:', e)
      const msg = e?.message || ''
      if (msg.includes('NotAllowedError')) {
        set({ error: '浏览器阻止了自动播放，请再次点击播放', isLoading: false })
      } else {
        set({ error: '加载失败，请重试', isLoading: false })
      }
    }
  },

  togglePlay: () => {
    const a = getAudio()
    const state = get()
    if (!state.currentTrack || state.isLoading) return

    if (state.isPlaying) {
      a.pause()
    } else {
      a.play().catch(() => {})
    }
  },

  next: () => {
    const { playlist, playlistIndex, isLoading } = get()
    if (playlist.length === 0 || isLoading) return
    const nextIdx = (playlistIndex + 1) % playlist.length
    get().play(playlist[nextIdx])
  },

  prev: () => {
    const { playlist, playlistIndex, isLoading } = get()
    if (playlist.length === 0 || isLoading) return
    if (get().progress > 3) {
      const a = getAudio()
      a.currentTime = 0
      return
    }
    const prevIdx = (playlistIndex - 1 + playlist.length) % playlist.length
    get().play(playlist[prevIdx])
  },

  setVolume: (v) => {
    const a = getAudio()
    a.volume = v
    set({ volume: v })
  },

  setProgress: (p) => {
    set({ progress: p })
  },

  seek: (p) => {
    const a = getAudio()
    a.currentTime = p
    set({ progress: p })
  },

  pause: () => {
    const a = getAudio()
    a.pause()
  },

  clearError: () => set({ error: null }),
}))

function setupAudioListeners() {
  const a = getAudio()
  a.addEventListener('timeupdate', () => {
    usePlayerStore.setState({ progress: a.currentTime })
  })
  a.addEventListener('durationchange', () => {
    if (a.duration && isFinite(a.duration)) {
      usePlayerStore.setState({ duration: a.duration })
    }
  })
  a.addEventListener('ended', () => {
    usePlayerStore.getState().next()
  })
  a.addEventListener('play', () => {
    usePlayerStore.setState({ isPlaying: true, isLoading: false })
  })
  a.addEventListener('pause', () => {
    usePlayerStore.setState({ isPlaying: false })
  })
  a.addEventListener('waiting', () => {
    usePlayerStore.setState({ isLoading: true })
  })
  a.addEventListener('canplay', () => {
    usePlayerStore.setState({ isLoading: false })
  })
  a.addEventListener('error', () => {
    const a = getAudio()
    // Ignore errors when there's no valid src (e.g., during track switching)
    if (!a.src || a.src === window.location.href || a.src.endsWith('/')) return
    usePlayerStore.setState({ isPlaying: false, isLoading: false })
    if (a.error) {
      usePlayerStore.setState({ error: '音频加载失败，请尝试其他歌曲' })
    }
  })
}

setupAudioListeners()
