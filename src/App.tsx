import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DiscoverPage from './pages/DiscoverPage'
import SearchPage from './pages/SearchPage'
import PlaylistPage from './pages/PlaylistPage'
import ToplistPage from './pages/ToplistPage'
import ArtistPage from './pages/ArtistPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/toplist" element={<ToplistPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
