import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"

export default function EventsTab({ venueId }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [venueId])

  const fetchEvents = async () => {
    try {
      const { ok, data } = await api.post("/event/search", {
        venue_id: venueId,
        per_page: 10,
        page: 1
      })
      if (!ok) throw new Error("Failed to fetch events")
      setEvents(data)
    } catch (error) {
      toast.error("Could not load events")
    } finally {
      setLoading(false)
    }
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events at this venue</h2>

      {events.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <AiOutlineCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
          <p className="text-sm text-gray-600">There are no events scheduled at this venue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }) {
  const formatDate = date => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatTime = date => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Link to={`/event/${event._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden block">
      {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">{event.category}</span>
          {event.price > 0 ? (
            <span className="text-sm font-bold text-gray-900">
              {event.price} {event.currency}
            </span>
          ) : (
            <span className="text-sm font-bold text-green-600">FREE</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <AiOutlineCalendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(event.start_date)} at {formatTime(event.start_date)}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center">
              <AiOutlineEnvironment className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">
                {event.venue}, {event.city}
              </span>
            </div>
          )}

          {event.organizer_name && (
            <div className="flex items-center">
              <AiOutlineUser className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">By {event.organizer_name}</span>
            </div>
          )}

          {event.capacity > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Available spots</span>
                <span className="text-xs font-semibold text-gray-900">
                  {event.available_spots} / {event.capacity}
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(event.available_spots / event.capacity) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
