import React from "react"

export default function OverviewTab({ venue }) {
  const imageUrl = venue.image_url ? (venue.image_url.startsWith("http") ? venue.image_url : `https://${venue.image_url}`) : null

  return (
    <div className="max-w-5xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Venue Details</h2>

        <div className="flex gap-6">
          {/* Left - Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="text-sm text-gray-900 mt-1">{venue.name || "No name"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Location</div>
              <div className="text-sm text-gray-900 mt-1">
                {venue.address ?? ""}, {venue.city ?? ""}, {venue.country ?? ""}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Capacity</div>
              <div className="text-sm text-gray-900 mt-1">{venue.capacity} seats</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Amenities</div>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">{venue.amenities?.join(", ") || "No amenities"}</span>
            </div>
          </div>

          {/* Right - Image */}
          {imageUrl && (
            <div className="w-64 flex-shrink-0">
              <img src={imageUrl} alt={venue.name} className="w-full h-48 object-cover rounded-lg" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner</h2>
        <div className="space-y-2">
          <div>
            <div className="text-sm font-medium text-gray-500">Name</div>
            <div className="text-sm text-gray-900 mt-1">{venue.owner_name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
