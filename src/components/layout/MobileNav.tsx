import { NavLink } from 'react-router-dom'
import { Home, Search, Heart } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '发现' },
  { to: '/favorites', icon: Heart, label: '收藏' },
  { to: '/search', icon: Search, label: '搜索' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden bg-white border-t border-gray-200 flex items-center justify-around px-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-0 ${
              isActive ? 'text-red-500' : 'text-gray-400'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
