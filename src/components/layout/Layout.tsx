import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import BottomPlayer from '../player/BottomPlayer'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top bar on mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-bold text-red-500">Melody</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: visible on desktop */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom player */}
      <div className="h-20 lg:h-20 border-t border-gray-200 bg-white shrink-0">
        <BottomPlayer />
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
