import { create } from 'zustand'
import type { Track } from '../api/types'

interface FavoritesState {
  tracks: Track[]
  add: (track: Track) => void
  remove: (id: number) => void
  toggle: (track: Track) => void
  has: (id: number) => boolean
}

function loadFavorites(): Track[] {
  try {
    const data = localStorage.getItem('melody-favorites')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveFavorites(tracks: Track[]) {
  try {
    localStorage.setItem('melody-favorites', JSON.stringify(tracks))
  } catch {
    // localStorage full or unavailable, silently ignore
  }
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  tracks: loadFavorites(),

  add: (track) => {
    const { tracks } = get()
    if (tracks.find((t) => t.id === track.id)) return
    const next = [track, ...tracks]
    saveFavorites(next)
    set({ tracks: next })
  },

  remove: (id) => {
    const next = get().tracks.filter((t) => t.id !== id)
    saveFavorites(next)
    set({ tracks: next })
  },

  toggle: (track) => {
    if (get().has(track.id)) {
      get().remove(track.id)
    } else {
      get().add(track)
    }
  },

  has: (id) => !!get().tracks.find((t) => t.id === id),
}))
