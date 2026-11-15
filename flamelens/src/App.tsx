import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Library from './pages/Library'
import Experiments from './pages/Experiments'
import Materials from './pages/Materials'
import MoonGap from './pages/MoonGap'
import Ask from './pages/Ask'
import RiskCalculator from './pages/RiskCalculator'
import Missions from './pages/Missions'
import CoolFlame from './pages/CoolFlame'
import Incidents from './pages/Incidents'
import About from './pages/About'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="research" element={<Library />} />
          <Route path="library" element={<Navigate to="/research" replace />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="materials" element={<Materials />} />
          <Route path="gravity-gap" element={<MoonGap />} />
          <Route path="moon-gap" element={<Navigate to="/gravity-gap" replace />} />
          <Route path="ask" element={<Ask />} />
          <Route path="risk-calculator" element={<RiskCalculator />} />
          <Route path="missions" element={<Missions />} />
          <Route path="cool-flame" element={<CoolFlame />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
