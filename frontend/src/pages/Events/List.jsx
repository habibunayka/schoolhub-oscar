import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Calendar, Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Mock user data - biasanya dari context/auth
const CURRENT_USER = {
  id: 1,
  role: 'club_admin', // 'student', 'club_admin', 'school_admin'
  clubId: 2, // jika club admin, ID club yang dia kelola
};

// Dummy events data
const DUMMY_EVENTS = [
  {
    id: 1,
    title: "Programming Workshop: React Fundamentals",
    organizer: "Programming Club",
    organizerId: 1,
    organizerType: "club",
    date: "2025-09-15",
    time: "14:00",
    location: "Computer Lab A",
    description: "Learn the basics of React.js with hands-on coding exercises. Perfect for beginners who want to start their web development journey.",
    maxParticipants: 30,
    currentParticipants: 18,
    isJoined: false,
    category: "workshop",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Annual Drama Performance: Romeo & Juliet",
    organizer: "Drama Society",
    organizerId: 2,
    organizerType: "club",
    date: "2025-09-20",
    time: "19:00",
    location: "Main Auditorium",
    description: "Join us for a spectacular performance of Shakespeare's timeless classic. Experience the passion, tragedy, and beauty of this beloved story.",
    maxParticipants: 200,
    currentParticipants: 156,
    isJoined: true,
    category: "performance",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Basketball Championship Finals",
    organizer: "Basketball Team",
    organizerId: 4,
    organizerType: "club",
    date: "2025-09-25",
    time: "16:00",
    location: "Sports Complex",
    description: "Cheer for our team in the final match of the championship. Come support our players as they compete for the trophy!",
    maxParticipants: 500,
    currentParticipants: 234,
    isJoined: false,
    category: "sports",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Science Fair 2025",
    organizer: "School Administration",
    organizerId: null,
    organizerType: "school",
    date: "2025-10-01",
    time: "09:00",
    location: "Exhibition Hall",
    description: "Showcase your innovative projects and discoveries. Students from all grades are invited to participate and present their research.",
    maxParticipants: 100,
    currentParticipants: 67,
    isJoined: true,
    category: "academic",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Music Concert: Jazz Night",
    organizer: "Music Ensemble",
    organizerId: 5,
    organizerType: "club",
    date: "2025-08-15",
    time: "20:00",
    location: "Music Hall",
    description: "An evening of smooth jazz and classic melodies performed by our talented music students. Relax and enjoy the music.",
    maxParticipants: 150,
    currentParticipants: 150,
    isJoined: false,
    category: "performance",
    status: "past"
  },
  {
    id: 6,
    title: "Environmental Cleanup Drive",
    organizer: "Environmental Club",
    organizerId: 3,
    organizerType: "club",
    date: "2025-08-20",
    time: "08:00",
    location: "Campus Grounds",
    description: "Help make our campus cleaner and greener. Bring gloves and water bottles. Together we can make a difference!",
    maxParticipants: 80,
    currentParticipants: 72,
    isJoined: true,
    category: "community",
    status: "past"
  },
  {
    id: 7,
    title: "Chess Tournament Semifinals",
    organizer: "Chess Club",
    organizerId: 10,
    organizerType: "club",
    date: "2025-09-30",
    time: "13:00",
    location: "Library Meeting Room",
    description: "The best chess players compete for a spot in the finals. Watch strategic gameplay and learn from the masters.",
    maxParticipants: 40,
    currentParticipants: 28,
    isJoined: false,
    category: "academic",
    status: "upcoming"
  },
  {
    id: 8,
    title: "Parent-Teacher Conference",
    organizer: "School Administration",
    organizerId: null,
    organizerType: "school",
    date: "2025-10-05",
    time: "10:00",
    location: "Various Classrooms",
    description: "Meet with teachers to discuss student progress and academic goals. Schedule individual appointments with subject teachers.",
    maxParticipants: 300,
    currentParticipants: 189,
    isJoined: false,
    category: "academic",
    status: "upcoming"
  }
];

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
    return {
      date: date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDate(event.date, event.time);
  const isFull = event.currentParticipants >= event.maxParticipants;

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
        {/* Join/Leave Button for Students */}
        {canJoin && (
          <button
            onClick={() => onJoinToggle(event.id)}
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
  const [events, setEvents] = useState(DUMMY_EVENTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
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

  const handleJoinToggle = (eventId) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { 
              ...event, 
              isJoined: !event.isJoined,
              currentParticipants: event.isJoined 
                ? event.currentParticipants - 1 
                : event.currentParticipants + 1
            }
          : event
      )
    );
  };

  const handleCreateEvent = () => {
    if (CURRENT_USER.role === "school_admin") {
      navigate("/events/new");
    } else if (CURRENT_USER.role === "club_admin") {
      navigate(`/clubs/${CURRENT_USER.clubId}/events/new`);
    }
  };

  const handleEdit = (eventId) => {
    alert(`Edit event ${eventId}`);
  };

  const handleDelete = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleViewDetails = (eventId) => {
    // Navigate to event details page
    window.location.href = `/events/${eventId}`;
  };

  const canCreateEvent = CURRENT_USER.role === 'school_admin' || CURRENT_USER.role === 'club_admin';

  if (loading) {
    return (
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
    );
  }

  return (
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

        {/* Create Event Button */}
        {canCreateEvent && (
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        )}
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
              currentUser={CURRENT_USER}
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
  );
}