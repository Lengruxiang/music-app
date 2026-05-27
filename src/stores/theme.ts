import { create } from 'zustand'

type Theme = 'dark' | 'light'

function getInitial(): Theme {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

applyTheme(getInitial())

interface ThemeStore {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitial(),
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try { localStorage.setItem('theme', next) } catch {}
    set({ theme: next })
  },
}))
