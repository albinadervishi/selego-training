import React from "react"
import { Routes, Route } from "react-router-dom"
import ListView from "./list"

export default function Home() {
  return (
    <div className="p-8">
      <Routes>
        <Route index element={<ListView />} />
      </Routes>
    </div>
  )
}
