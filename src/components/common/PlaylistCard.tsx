import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import type { Playlist } from '../../api/types'

interface Props {
  playlist: Playlist
}

export default function PlaylistCard({ playlist }: Props) {
  const countText = playlist.playCount > 10000
    ? `${(playlist.playCount / 10000).toFixed(1)}万`
    : `${playlist.playCount}`

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group block bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square mb-2 overflow-hidden rounded-md">
        <img
          src={playlist.coverImgUrl ?? playlist.picUrl}
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Play
            size={36}
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white"
          />
        </div>
        <span className="absolute top-1 right-1.5 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">
          {countText}
        </span>
      </div>
      <p className="text-sm font-medium line-clamp-2 leading-5">{playlist.name}</p>
    </Link>
  )
}
