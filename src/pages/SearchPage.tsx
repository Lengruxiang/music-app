import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { search, getSearchSuggest } from '../api/music'
import { usePlayerStore } from '../stores/player'
import TrackList from '../components/common/TrackList'
import type { Track } from '../api/types'

const TABS = [
  { key: 1, label: '歌曲' },
  { key: 100, label: '歌手' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') || ''
  const [input, setInput] = useState(urlQuery)
  const [activeTab, setActiveTab] = useState(1)
  const [results, setResults] = useState<any>(null)
  const [suggests, setSuggests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const play = usePlayerStore((s) => s.play)
  const currentTrack = usePlayerStore((s) => s.currentTrack)

  const doSearch = useCallback(async (keywords: string, tab?: number) => {
    const t = tab ?? activeTab
    if (!keywords.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await search(keywords, t, 30)
      setResults(res.result || res)
    } catch (e) {
      console.error('Search failed:', e)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  // Initial load from URL (only on mount)
  useEffect(() => {
    if (urlQuery) {
      setInput(urlQuery)
      doSearch(urlQuery)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Tab switch re-search
  const handleTabChange = (tab: number) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    if (urlQuery) {
      doSearch(urlQuery, tab)
    }
  }

  const handleInputChange = async (val: string) => {
    setInput(val)
    if (val.trim()) {
      try {
        const res = await getSearchSuggest(val)
        const allSuggest = res.result?.allMatch || res.result?.songs || []
        setSuggests(
          allSuggest
            .slice(0, 8)
            .map((s: any) => s.keyword || '')
            .filter(Boolean)
        )
      } catch {
        setSuggests([])
      }
    } else {
      setSuggests([])
    }
  }

  const triggerSearch = (keywords: string) => {
    if (!keywords.trim()) return
    setInput(keywords)
    setSuggests([])
    setSearchParams({ q: keywords })
    doSearch(keywords)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      triggerSearch(input)
    }
  }

  const handlePlay = (track: Track) => {
    const songs = results?.songs || []
    play(track, songs)
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Search input */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索歌曲、歌手、专辑..."
          className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none text-sm"
        />
        {input && (
          <button
            onClick={() => { setInput(''); setSuggests([]); setSearched(false); setResults(null) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}

        {/* Suggestions dropdown */}
        {suggests.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 mt-1 z-10 py-2">
            {suggests.map((s, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                onClick={() => triggerSearch(s)}
              >
                <Search size={14} className="text-gray-400" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      {searched && (
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-red-500 text-red-500 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Results: Songs */}
      {!loading && results && activeTab === 1 && (
        <>
          {results.songs?.length > 0 ? (
            <TrackList
              tracks={results.songs}
              onPlay={handlePlay}
              highlightId={currentTrack?.id ?? null}
            />
          ) : (
            <p className="text-center text-gray-400 mt-12">未找到相关歌曲</p>
          )}
        </>
      )}

      {/* Results: Artists */}
      {!loading && results && activeTab === 100 && (
        <div className="space-y-2">
          {results.artists?.length > 0 ? (
            results.artists.map((artist: any) => (
              <Link
                key={artist.id}
                to={`/artist/${artist.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
              >
                <img src={artist.picUrl || artist.img1v1Url} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium">{artist.name}</p>
                  <p className="text-xs text-gray-400">
                    专辑：{artist.albumSize ?? '-'} · 歌曲：{artist.musicSize ?? '-'}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-12">未找到相关歌手</p>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <div className="text-center text-gray-400 mt-20">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>输入关键词搜索音乐</p>
          <p className="text-xs mt-1">按 Enter 搜索</p>
        </div>
      )}
    </div>
  )
}
