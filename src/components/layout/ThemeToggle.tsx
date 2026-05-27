import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../../stores/theme'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  const isLight = theme === 'light'

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm w-full transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]"
      title={isLight ? '切换暗色模式' : '切换亮色模式'}
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
      {isLight ? '暗色模式' : '亮色模式'}
    </button>
  )
}
