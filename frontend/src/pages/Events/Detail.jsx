import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent, rsvpEvent, updateEvent as apiUpdateEvent, deleteEvent as apiDeleteEvent } from "@services/events.js";
import { me as getCurrentUser } from "@services/auth.js";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@components/common/ui/feedback";
import SafeImage from "@/components/SafeImage";

export default function EventDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: getCurrentUser });
    const {
      data,
      isLoading,
      error,
    } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id),
    enabled: /^\d+$/.test(id),
  });

  if (!/^\d+$/.test(id)) return <div className="p-4">Not found</div>;
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading event</div>;
  if (!data) return <div className="p-4">Not found</div>;

  const role =
    user?.role_global === "school_admin"
      ? "school_admin"
      : user?.club_id
      ? "club_admin"
      : "student";
  const isPast = new Date(data.end_at) < new Date();
  const canJoin = role === "student" && !isPast && data.require_rsvp;
  const isJoined = data.rsvp_status === "going";
  const participantCount = Number(data.participant_count) || 0;
  const isFull =
    data.capacity != null && participantCount >= data.capacity;
  const canEdit =
    role === "school_admin" || (role === "club_admin" && data.club_id === user?.club_id);
  const canDelete = role === "school_admin";

  const handleJoinToggle = async () => {
    const updated = await rsvpEvent(id, { status: isJoined ? "declined" : "going" });
    queryClient.setQueryData(["event", id], (old) => ({
      ...old,
      participant_count: updated.participant_count,
      rsvp_status: updated.rsvp_status,
    }));
  };

  const handleEdit = async () => {
    const newTitle = prompt("Edit title", data.title);
    if (newTitle && newTitle !== data.title) {
      await apiUpdateEvent(id, { title: newTitle });
      queryClient.setQueryData(["event", id], (old) => ({
        ...old,
        title: newTitle,
      }));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await apiDeleteEvent(id);
      window.location.href = "/events";
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const date = d.toISOString().slice(0, 10);
    const time = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const { date, time } = formatDate(data.start_at);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        {data.image_url && (
          <SafeImage
            src={data.image_url}
            alt={data.title}
            className="w-full object-cover rounded-md"
          />
        )}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold mb-1">{data.title}</h1>
            <p className="text-blue-600 font-medium">{data.club_name}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isPast ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
            }`}
          >
            {isPast ? "Past" : "Upcoming"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-600">
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
            <span>{data.location}</span>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{data.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            {participantCount}
            {data.capacity ? ` / ${data.capacity}` : ""} participants
          </span>
          {isFull && !isPast && (
            <span className="text-red-600 font-medium">(Full)</span>
          )}
        </div>

        <div className="flex gap-2">
          {canJoin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isFull && !isJoined}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isJoined
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : isFull
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isJoined ? "Cancel RSVP" : isFull ? "Full" : "RSVP"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isJoined ? "Cancel RSVP?" : "RSVP to event?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isJoined
                      ? "Are you sure you want to cancel your RSVP?"
                      : "Confirm your attendance by RSVP."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {!isFull && (
                    <AlertDialogAction
                      onClick={handleJoinToggle}
                      className={
                        isJoined
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }
                    >
                      {isJoined ? "Cancel RSVP" : "RSVP"}
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {canEdit && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-lg font-medium text-sm border border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg font-medium text-sm border border-red-300 text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
