import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import type { Playlist } from '../../api/types'
import { fixImg } from '../../utils/img'

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
      className="group block bg-[#181818] rounded-xl p-3 hover:bg-[#252525] transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
        <img
          src={fixImg(playlist.coverImgUrl ?? (playlist as any).picUrl, 300)}
          alt={playlist.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#ff4757] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-[#ff4757]/30">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </div>
        <span className="absolute top-2 right-2 text-[11px] text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
          {countText}
        </span>
      </div>
      <p className="text-sm font-medium text-white line-clamp-2 leading-5">{playlist.name}</p>
    </Link>
  )
}
