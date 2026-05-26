import { NavLink } from 'react-router-dom'
import { Home, Search, BarChart3 } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '发现音乐' },
  { to: '/toplist', icon: BarChart3, label: '排行榜' },
  { to: '/search', icon: Search, label: '搜索' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-5">
        <h1 className="text-xl font-bold text-red-500">Melody</h1>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-500 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
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
