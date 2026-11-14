import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Library from './pages/Library'
import Experiments from './pages/Experiments'
import Materials from './pages/Materials'
import MoonGap from './pages/MoonGap'
import Ask from './pages/Ask'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="library" element={<Library />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="materials" element={<Materials />} />
          <Route path="moon-gap" element={<MoonGap />} />
          <Route path="ask" element={<Ask />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
