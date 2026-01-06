import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineCalendar, AiOutlinePlus } from "react-icons/ai"
import { Menu } from "@headlessui/react"
import api from "@/services/api"
import toast from "react-hot-toast"
import { CreateVenueModal } from "@/components/venues"

export default function MyVenues() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchMyVenues()
  }, [])

  const fetchMyVenues = async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/venue/my-venues/search", {
        per_page: 50,
        page: 1
      })
      if (!ok) throw new Error("Failed to fetch venues")
      setVenues(data || [])
    } catch (error) {
      toast.error("Could not load your venues")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async venueId => {
    if (!confirm("Are you sure you want to delete this venue?")) return

    try {
      const { ok } = await api.delete(`/venue/${venueId}`)
      if (!ok) throw new Error("Failed to delete venue")

      toast.success("Venue deleted successfully")
      setVenues(venues.filter(v => v._id !== venueId))
    } catch (error) {
      toast.error("Failed to delete venue")
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
            <p className="text-gray-600 mt-2">Venues you've created</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Venue
          </button>
        </div>

        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Your Venues Dashboard</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>
                  This page shows venues where you are the <strong>owner</strong>.
                </p>
                <p className="mt-1">
                  Data comes from <code className="bg-purple-100 px-1 rounded">POST /venue/my-venues/search</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
          <p className="text-gray-600 mb-4">Create your first venue to get started!</p>
          <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            <AiOutlinePlus className="w-5 h-5" />
            Create Your First Venue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map(venue => (
            <VenueRow key={venue._id} venue={venue} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Venue Modal */}
      <CreateVenueModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          fetchMyVenues() // Refresh list
        }}
      />
    </div>
  )
}

function VenueRow({ venue, onDelete }) {
  const navigate = useNavigate()

  const formatDate = date => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusBadge = status => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status] || styles.draft}`}>{status.toUpperCase()}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{venue.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <p>
                {venue.address ?? ""}, {venue.city ?? ""}, {venue.country ?? ""}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Capacity:</span>
              <p>{venue.capacity}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">{venue.amenities?.join(", ") || "No amenities"}</span>
          </div>
        </div>

        <Menu as="div" className="relative ml-4">
          <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => navigate(`/venue/${venue._id}`)} className={`${active ? "bg-gray-100" : ""} flex items-center w-full px-4 py-2 text-sm text-gray-700`}>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate(`/venue/${venue._id}/edit`)}
                    className={`${active ? "bg-gray-100" : ""} flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Venue
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate(`/venue/${venue._id}/events`)}
                    className={`${active ? "bg-gray-100" : ""} flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    View Events
                  </button>
                )}
              </Menu.Item>

              <div className="border-t border-gray-100 my-1"></div>

              <Menu.Item>
                {({ active }) => (
                  <button onClick={() => onDelete(venue._id)} className={`${active ? "bg-red-50" : ""} flex items-center w-full px-4 py-2 text-sm text-red-600`}>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Venue
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  )
}
