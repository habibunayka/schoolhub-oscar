import React from "react";
import { Calendar, Clock, MapPin, Users, Eye, Edit, Trash2, Globe, Lock } from "lucide-react";
import SafeImage from "@components/SafeImage";

/**
 * Shared event card used in event listings and club profile pages.
 * Most actions are optional and will only render when corresponding
 * handler props are provided.
 */
export default function EventCard({
  event,
  currentUser,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  const role = currentUser?.role;
  const isPastEvent = event.status === "past";
  const canEdit =
    role === "school_admin" ||
    (role === "club_admin" && event.organizerId === currentUser?.clubId);
  const canDelete =
    role === "school_admin" ||
    (role === "club_admin" && event.organizerId === currentUser?.clubId);

  const visibilityIcon =
    event.visibility === "public" ? Globe : event.visibility === "private" ? Lock : null;

  const dateObj = new Date(event.startAt);
  const date = dateObj.toLocaleDateString("id-ID");
  const time = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const isFull =
    event.maxParticipants != null &&
    event.currentParticipants >= event.maxParticipants;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
        isPastEvent ? "opacity-60" : ""
      }`}
    >
      <SafeImage
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-40 object-cover rounded-md mb-4"
        sizePx={256}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-blue-600 font-medium">{event.organizer}</p>
        </div>
        <div className="flex items-center gap-2">
          {visibilityIcon && (
            <span className="p-1 bg-white rounded-full shadow">
              <visibilityIcon
                className={`w-4 h-4 ${
                  event.visibility === "public" ? "text-green-600" : "text-red-600"
                }`}
              />
            </span>
          )}
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isPastEvent ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
            }`}
          >
            {isPastEvent ? "Past" : "Upcoming"}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Participants */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>
          {event.currentParticipants} / {event.maxParticipants} participants
        </span>
        {isFull && !isPastEvent && (
          <span className="text-red-600 font-medium">(Full)</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(event.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
        )}

        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(event.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}

        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-red-300 text-red-700 hover:bg-red-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
