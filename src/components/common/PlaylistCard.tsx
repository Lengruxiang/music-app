import { Link } from 'react-router-dom'
import { Play, Music } from 'lucide-react'
import type { Playlist } from '../../api/types'

const GRADIENTS = [
  'from-slate-400 to-slate-500',
  'from-stone-400 to-stone-500',
  'from-zinc-400 to-zinc-500',
  'from-neutral-400 to-neutral-500',
  'from-slate-300 to-zinc-400',
  'from-stone-300 to-neutral-400',
  'from-zinc-300 to-slate-400',
  'from-neutral-300 to-stone-400',
  'from-gray-400 to-gray-500',
  'from-gray-300 to-slate-400',
]

function simplifyName(name: string): string {
  // Split on common delimiters, take first part
  const parts = name.split(/[|｜·—，,!！\-—]/)
  let clean = parts[0].trim()

  // Remove year prefix like "2026" at start
  clean = clean.replace(/^\d{4}\s*/, '')

  // Trim very long names
  if (clean.length > 12) {
    clean = clean.slice(0, 10) + '…'
  }

  return clean || name.slice(0, 10) + '…'
}

function gradientClass(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

interface Props {
  playlist: Playlist
}

export default function PlaylistCard({ playlist }: Props) {
  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group block bg-[var(--bg-card)] rounded-xl p-3 hover:bg-[var(--bg-card-hover)] transition-all duration-300 hover:shadow-lg"
    >
      <div className={`relative aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br ${gradientClass(playlist.name)} flex items-center justify-center`}>
        <Music size={48} className="text-white/30 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <Play size={20} className="text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-[var(--text)] line-clamp-1 leading-5">{simplifyName(playlist.name)}</p>
    </Link>
  )
}
