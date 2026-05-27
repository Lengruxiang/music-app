import { NavLink } from 'react-router-dom'
import { Home, Search, BarChart3, Heart } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '发现音乐' },
  { to: '/toplist', icon: BarChart3, label: '排行榜' },
  { to: '/favorites', icon: Heart, label: '我的收藏' },
  { to: '/search', icon: Search, label: '搜索' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-[#111] border-r border-[#2a2a2a] flex flex-col shrink-0">
      <div className="p-5">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#ff4757] to-[#ff6b81] bg-clip-text text-transparent">Melody</h1>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm mb-0.5 transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
