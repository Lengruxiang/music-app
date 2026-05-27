import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import BottomPlayer from '../player/BottomPlayer'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-[var(--bg)]">
      <header className="lg:hidden bg-[var(--bg-header)] border-b border-[var(--border)] px-4 py-2.5 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-bold bg-gradient-to-r from-[#ff4757] to-[#ff6b81] bg-clip-text text-transparent">Melody</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="h-20 border-t border-[var(--border)] bg-[var(--bg-header)] backdrop-blur-xl shrink-0">
        <BottomPlayer />
      </div>

      <MobileNav />
    </div>
  )
}
