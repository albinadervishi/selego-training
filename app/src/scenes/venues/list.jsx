import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineTeam, AiOutlineEnvironment, AiOutlineUser, AiOutlineCalendar, AiOutlineInfoCircle } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"

export default function ListView() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    available_start: "",
    available_end: ""
  })

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/venue/search", {
        search: filters.search,
        city: filters.city,
        available_start: filters.available_start || undefined,
        available_end: filters.available_end || undefined,
        per_page: 20,
        page: 1
      })

      if (!ok) throw new Error("Failed to fetch venues")
      setVenues(data || [])
    } catch (error) {
      toast.error("Could not load venues")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchVenues()
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Info card */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AiOutlineInfoCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Venue Search</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This page displays all <strong>venues</strong>.
              </p>
              <p className="mt-1">
                Data comes from <code className="bg-blue-100 px-1 rounded">POST /venue/search</code> endpoint.
              </p>
              <p className="mt-1">
                <strong>Public route:</strong> No authentication required - anyone can browse venues.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Venue name, address, city, or country..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              placeholder="Paris, Lyon..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.available_start}
              onChange={e => setFilters({ ...filters, available_start: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.available_end}
              onChange={e => setFilters({ ...filters, available_end: e.target.value })}
            />
          </div>
          <button type="submit" className=" px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Search Venues
          </button>
        </div>
      </form>

      {venues.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-600 mb-4">There are no venues matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map(venue => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  )
}

function VenueCard({ venue }) {
  const imageUrl = venue.image_url ? (venue.image_url.startsWith("http") ? venue.image_url : `https://${venue.image_url}`) : null

  return (
    <Link to={`/venue/${venue._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden block">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{venue.name}</h3>
          {imageUrl && <img src={imageUrl} alt={venue.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
        </div>

        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">{venue.amenities?.join(", ") || "No amenities"}</span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <AiOutlineTeam className="w-4 h-4 mr-2" />
            <span>{venue.capacity} seats</span>
          </div>

          {(venue.address || venue.city || venue.country) && (
            <div className="flex items-center">
              <AiOutlineEnvironment className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">
                {venue.address ?? ""}, {venue.city ?? ""}, {venue.country ?? ""}
              </span>
            </div>
          )}

          {venue.owner_name && (
            <div className="flex items-center">
              <AiOutlineUser className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">By {venue.owner_name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
