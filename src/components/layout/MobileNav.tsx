import { NavLink } from 'react-router-dom'
import { Home, Search, Heart } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: '发现' },
  { to: '/favorites', icon: Heart, label: '收藏' },
  { to: '/search', icon: Search, label: '搜索' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden bg-[#111] border-t border-[#2a2a2a] flex items-center justify-around px-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-0 transition-colors ${
              isActive ? 'text-[#ff4757]' : 'text-[#6b7280]'
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
