import { ConfigNotice } from '../components/Layout'
import MoonGapChart from '../components/MoonGapChart'

export default function MoonGap() {
  return (
    <main className="page">
      <div className="eyebrow">Moon Base Gap</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>The data stops at <span className="serif">0.166 g</span></h1>
      <p className="lead">
        We have flammability data from the Space Station (0 g) and from Earth labs (1 g). The Moon sits in between at 0.166 g, and no spaceflight measurement exists there yet.
      </p>
      <ConfigNotice />
      <MoonGapChart />
    </main>
  )
}
