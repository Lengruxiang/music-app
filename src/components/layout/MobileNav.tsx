import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/theme'

const navItems = [
  { to: '/', icon: Home, label: '发现' },
  { to: '/favorites', icon: Heart, label: '收藏' },
  { to: '/search', icon: Search, label: '搜索' },
]

export default function MobileNav() {
  const { theme, toggle } = useThemeStore()

  return (
    <nav className="lg:hidden bg-[var(--bg-header)] border-t border-[var(--border)] flex items-center justify-around px-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-0 transition-colors ${
              isActive ? 'text-[#ff4757]' : 'text-[var(--text-tertiary)]'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
      <button
        onClick={toggle}
        className="flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-0 text-[var(--text-tertiary)]"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        <span className="text-[10px]">{theme === 'light' ? '暗色' : '亮色'}</span>
      </button>
    </nav>
  )
}
