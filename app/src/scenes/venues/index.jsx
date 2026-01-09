import { Routes, Route } from "react-router-dom"
import VenuesList from "./list"
import VenueView from "./view"

export default function Venues() {
  return (
    <Routes>
      <Route path="/" element={<VenuesList />} />
      <Route path="/:id/*" element={<VenueView />} />
    </Routes>
  )
}
