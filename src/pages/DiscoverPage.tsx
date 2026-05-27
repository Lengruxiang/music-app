import { useEffect, useRef } from 'react'
import PlaylistCard from '../components/common/PlaylistCard'
import TrackList from '../components/common/TrackList'
import { getTopPlaylists, getNewSongs } from '../api/music'
import { usePlayerStore } from '../stores/player'
import { useDiscoverStore } from '../stores/discover'
import type { Track } from '../api/types'

const CATEGORY_POOL = ['华语', '欧美', '日语', '韩语', '电子', '摇滚', '民谣', '说唱', '古风', '轻音乐', 'R&B']
const NEW_SONG_TYPES = [0, 7, 96, 8, 16]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle([...arr]).slice(0, n)
}

export default function DiscoverPage() {
  const store = useDiscoverStore()
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)
  const fetching = useRef(false)

  useEffect(() => {
    if (fetching.current) return
    fetching.current = true

    const randomCat = pick(CATEGORY_POOL, 1)[0]
    const songType = NEW_SONG_TYPES[Math.floor(Math.random() * NEW_SONG_TYPES.length)]
    const songLabels: Record<number, string> = { 0: '新歌', 7: '华语新歌', 96: '欧美新歌', 8: '日语新歌', 16: '韩语新歌' }

    if (!store.loaded) store.setLoading(true)

    async function load() {
      try {
        const [cantoneseRes, randomRes, songRes] = await Promise.all([
          getTopPlaylists('粤语', 100),
          getTopPlaylists(randomCat, 100),
          getNewSongs(songType),
        ])

        const processPlaylists = (list: any[]) =>
          shuffle(
            (list || [])
              .filter((p: any) => p.trackCount >= 50)
              .sort((a: any, b: any) => b.playCount - a.playCount)
          ).slice(0, 12)

        store.setData({
          cantonese: processPlaylists(cantoneseRes.playlists || []),
          randomSection: { cat: randomCat, list: processPlaylists(randomRes.playlists || []) },
          newSongs: shuffle((songRes.data || []) as Track[]).slice(0, 20),
          songTypeLabel: songLabels[songType] || '新歌',
        })
      } catch (e) {
        console.error('Failed to load discover page:', e)
        store.setLoading(false)
      }
      fetching.current = false
    }
    load()
  }, [])

  const handlePlay = (track: Track) => {
    play(track, store.newSongs)
  }

  if (!store.loaded) {
    return (
      <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
        {[1, 2, 3].map((section) => (
          <div key={section} className="animate-pulse space-y-4">
            <div className="h-6 w-24 bg-[var(--skeleton)] rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-square bg-[var(--skeleton)] rounded-lg mb-2" />
                  <div className="h-4 bg-[var(--skeleton)] rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 space-y-8 sm:space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d1b69] via-[#1a1a3e] to-[#0d1117] p-6 sm:p-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#7c3aed] to-[#a78bfa] rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-white">发现音乐</h2>
          <p className="text-sm sm:text-base text-white/70 max-w-md">每次刷新都有新发现，探索无限音乐世界</p>
        </div>
      </div>

      {/* 粤语歌单 - 常驻 */}
      {store.cantonese.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">粤语歌单</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {store.cantonese.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      {/* 随机歌单 */}
      {store.randomSection.list.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">{store.randomSection.cat} 歌单</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {store.randomSection.list.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl as any} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text)]">{store.songTypeLabel}</h3>
        </div>
        <TrackList
          tracks={store.newSongs}
          onPlay={handlePlay}
          highlightId={currentTrack?.id ?? null}
        />
      </section>
    </div>
  )
}
