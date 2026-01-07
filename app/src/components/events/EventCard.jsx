import React from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser } from "react-icons/ai"

export default function EventCard({ event }) {
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
