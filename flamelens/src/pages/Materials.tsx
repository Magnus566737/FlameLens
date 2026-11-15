import { ConfigNotice } from '../components/Layout'
import MaterialsTable from '../components/MaterialsTable'

export default function Materials() {
  return (
    <main className="page">
      <div className="eyebrow">Materials</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>Spacecraft material <span className="serif">flammability</span></h1>
      <ConfigNotice />
      <div className="notice" role="note">
        BASS-II values cover 0g ISS conditions. Lunar surface (1/6g) data pending FM2 mission.
      </div>
      <MaterialsTable />
    </main>
  )
}
