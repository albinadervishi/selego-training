import React, { useState, useEffect } from "react"
import { AiOutlineCalendar } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import EventCard from "@/components/events/EventCard"

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
