import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToplistDetail } from '../api/music'
import type { Track } from '../api/types'
import { fixImg } from '../utils/img'

interface ToplistItem {
  id: number
  name: string
  coverImgUrl: string
  updateFrequency: string
  tracks: Track[]
}

export default function ToplistPage() {
  const [lists, setLists] = useState<ToplistItem[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await getToplistDetail()
        setLists(res.list || [])
      } catch (e) {
        console.error('Failed to load toplists:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3 bg-white rounded-lg p-3">
              <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      <h2 className="text-lg font-bold mb-4">排行榜</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {lists.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/playlist/${item.id}`)}
            className="flex gap-3 bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              src={fixImg(item.coverImgUrl, 300)}
              alt={item.name}
              loading="lazy" className="w-24 h-24 rounded-lg object-cover shrink-0"
            />
            <div className="flex items-center min-w-0 py-0.5">
              <p className="text-sm font-bold line-clamp-2 leading-5">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
