import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "@/services/api"
import toast from "react-hot-toast"
import FileInput from "@/components/file-input"

export default function EditTab({ venue, fetchVenue }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "France",
    capacity: 0,
    image_url: "",
    amenities: []
  })

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || "",
        address: venue.address || "",
        city: venue.city || "",
        country: venue.country || "France",
        capacity: venue.capacity || 0,
        image_url: venue.image_url || "",
        amenities: venue.amenities || []
      })
    }
  }, [venue])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name || !formData.address || !formData.city || !formData.country) {
      toast.error("Name, address, city and country are required")
      return
    }

    try {
      setSaving(true)
      const { ok } = await api.put(`/venue/${id}`, formData)
      if (!ok) throw new Error("Failed to update venue")

      toast.success("Venue updated successfully!")
      await fetchVenue()
      navigate(`/venue/${id}`)
    } catch (error) {
      toast.error(error.message || "Failed to update venue")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Two-Step Creation Pattern</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Common UX pattern: <strong>quick create → detailed edit → publish</strong>
                </p>
                <p className="mt-1">
                  Updates use <code className="bg-green-100 px-1 rounded">PUT /venue/:id</code>
                </p>
                <p className="mt-1">
                  Fill in optional details, then click <strong>Publish Event</strong> to make it visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Image</label>
              <FileInput
                name="image_url"
                value={formData.image_url}
                onChange={e => {
                  const url = Array.isArray(e.target.value) ? e.target.value[0] : e.target.value
                  setFormData({ ...formData, image_url: url || "" })
                }}
                folder="/venues"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Convention Center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
                <span className="text-gray-500 text-xs ml-2">(0 = unlimited)</span>
              </label>
              <input
                type="number"
                name="capacity"
                min="0"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["WiFi", "Parking", "Catering", "Bar", "Projector", "Whiteboard", "Microphone", "Recording", "Outdoor Terrace", "Other"].map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity)}
                      onChange={e => {
                        const current = formData.amenities || []
                        const updated = e.target.checked ? [...current, amenity] : current.filter(a => a !== amenity)
                        setFormData({ ...formData, amenities: updated })
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => navigate("/my-events")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
