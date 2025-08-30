import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { listAllEvents, rsvpEvent } from "@services/events.js";
import { me as getCurrentUser } from "@services/auth.js";
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
import useConfirm from "@hooks/useConfirm.jsx";


const FILTER_OPTIONS = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past Events' },
  { value: 'club', label: 'Club Events' },
  { value: 'school', label: 'School Events' },
];

// Loading Skeleton Component
function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, currentUser, onJoinToggle, onEdit, onDelete, onViewDetails }) {
  const isPastEvent = event.status === 'past';
  const canEdit = (currentUser.role === 'school_admin') || 
                  (currentUser.role === 'club_admin' && event.organizerId === currentUser.clubId);
  const canDelete = currentUser.role === 'school_admin';
  const canJoin = currentUser.role === 'student' && !isPastEvent;

  const formatDate = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return {
      date: `${year}-${month}-${day}`,
      time: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDate(event.date, event.time);
  const isFull =
    event.maxParticipants != null &&
    event.currentParticipants >= event.maxParticipants;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
      isPastEvent ? 'opacity-60' : ''
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-blue-600 font-medium">
            {event.organizer}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          isPastEvent ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
        }`}>
          {isPastEvent ? 'Past' : 'Upcoming'}
        </span>
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
      <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
        {event.description}
      </p>

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
        {canJoin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isFull && !event.isJoined}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  event.isJoined
                    ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
                    : isFull
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
                }`}
              >
                {event.isJoined ? 'Leave' : isFull ? 'Full' : 'Join'}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {event.isJoined ? 'Leave event?' : 'Join event?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {event.isJoined
                    ? 'Are you sure you want to leave this event?'
                    : 'Confirm your participation in this event.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {!isFull && (
                  <AlertDialogAction
                    onClick={() => onJoinToggle(event.id, event.isJoined)}
                    className={
                      event.isJoined
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  >
                    {event.isJoined ? 'Leave' : 'Join'}
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(event.id)}
          className="px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>

        {/* Edit Button for Admins */}
        {canEdit && (
          <button
            onClick={() => onEdit(event.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}

        {/* Delete Button for School Admin */}
        {canDelete && (
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

// Main Events Page
export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
      async function fetchData() {
        try {
          const [user, eventsRes] = await Promise.all([
            getCurrentUser(),
            listAllEvents(),
          ]);
          const role = user.role_global === 'school_admin'
            ? 'school_admin'
            : user.club_id ? 'club_admin' : 'student';
          setCurrentUser({ id: user.id, role, clubId: user.club_id });
          const mapped = eventsRes.map(e => ({
            id: e.id,
            title: e.title,
            organizer: e.club_name,
            organizerId: e.club_id,
            organizerType: 'club',
            date: e.start_at.slice(0,10),
            time: e.start_at.slice(11,16),
            location: e.location,
            description: e.description,
            imageUrl: e.image_url,
            maxParticipants: e.capacity,
            currentParticipants: Number(e.participant_count) || 0,
            isJoined: e.rsvp_status === 'going',
            category: e.visibility,
            status: new Date(e.end_at) < new Date() ? 'past' : 'upcoming',
          }));
          setEvents(mapped);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'upcoming':
        filtered = filtered.filter(event => event.status === 'upcoming');
        break;
      case 'past':
        filtered = filtered.filter(event => event.status === 'past');
        break;
      case 'club':
        filtered = filtered.filter(event => event.organizerType === 'club');
        break;
      case 'school':
        filtered = filtered.filter(event => event.organizerType === 'school');
        break;
      default:
        break;
    }

    // Sort by date (upcoming first, then past)
    return filtered.sort((a, b) => {
      if (a.status === 'upcoming' && b.status === 'past') return -1;
      if (a.status === 'past' && b.status === 'upcoming') return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [events, searchQuery, filterType]);

  const handleJoinToggle = async (eventId, isJoined) => {
    try {
      const updated = await rsvpEvent(eventId, {
        status: isJoined ? 'declined' : 'going',
      });
      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? {
                ...event,
                isJoined: updated.rsvp_status === 'going',
                currentParticipants: Number(updated.participant_count) || 0,
              }
            : event
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const { confirm, ConfirmDialog } = useConfirm();

  const handleEdit = (eventId) => {
    alert(`Edit event ${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (await confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleViewDetails = (eventId) => {
    // Navigate to event details page
    window.location.href = `/events/${eventId}`;
  };


    if (loading) {
      return (
        <>
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
      </>
    );
    }

    if (!currentUser) return null;

  return (
    <>
    <ConfirmDialog />
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">
          Discover and join exciting events happening in our school
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        {/* Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
        >
          {FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters to find events.'
              : 'No events are currently available. Check back later for exciting upcoming events!'
            }
          </p>
          {(searchQuery || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchInput('');
                setFilterType('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              currentUser={currentUser}
              onJoinToggle={handleJoinToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredEvents.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
    </>
  );
}