import { create } from 'zustand'
import type { Track } from '../api/types'

interface SimplePlaylist {
  id: number
  name: string
  coverImgUrl: string
  playCount: number
  trackCount: number
}

interface DiscoverState {
  cantonese: SimplePlaylist[]
  randomSection: { cat: string; list: SimplePlaylist[] }
  newSongs: Track[]
  songTypeLabel: string
  loading: boolean
  loaded: boolean
  setData: (data: {
    cantonese: SimplePlaylist[]
    randomSection: { cat: string; list: SimplePlaylist[] }
    newSongs: Track[]
    songTypeLabel: string
  }) => void
  setLoading: (v: boolean) => void
}

export const useDiscoverStore = create<DiscoverState>((set) => ({
  cantonese: [],
  randomSection: { cat: '', list: [] },
  newSongs: [],
  songTypeLabel: '',
  loading: true,
  loaded: false,
  setData: (data) => set({ ...data, loading: false, loaded: true }),
  setLoading: (v) => set({ loading: v }),
}))
