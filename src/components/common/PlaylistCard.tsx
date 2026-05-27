import { Link } from 'react-router-dom'
import { Play, Music } from 'lucide-react'
import type { Playlist } from '../../api/types'

const GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-sky-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-violet-500 to-fuchsia-600',
  'from-cyan-400 to-sky-600',
  'from-rose-400 to-pink-600',
  'from-lime-400 to-green-600',
  'from-fuchsia-500 to-purple-700',
]

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
      <p className="text-sm font-medium text-[var(--text)] line-clamp-2 leading-5">{playlist.name}</p>
    </Link>
  )
}
