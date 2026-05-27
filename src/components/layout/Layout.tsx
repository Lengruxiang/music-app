import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import BottomPlayer from '../player/BottomPlayer'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d]">
      <header className="lg:hidden bg-[#111] border-b border-[#2a2a2a] px-4 py-2.5 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-bold bg-gradient-to-r from-[#ff4757] to-[#ff6b81] bg-clip-text text-transparent">Melody</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#111] via-[#0d0d0d] to-[#0d0d0d]">
          <Outlet />
        </main>
      </div>

      <div className="h-20 border-t border-[#2a2a2a] bg-[#111] backdrop-blur-xl shrink-0">
        <BottomPlayer />
      </div>

      <MobileNav />
    </div>
  )
}
