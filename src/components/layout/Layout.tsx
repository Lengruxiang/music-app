import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomPlayer from '../player/BottomPlayer'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="h-20 border-t border-gray-200 bg-white shrink-0">
        <BottomPlayer />
      </div>
    </div>
  )
}
