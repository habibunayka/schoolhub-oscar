import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Megaphone,
  Filter,
  ChevronRight
} from 'lucide-react';
import announcements from "@services/announcements.js";
import { me as getCurrentUser } from "@services/auth.js";
import useConfirm from "@hooks/useConfirm.jsx";
const TARGET_OPTIONS = [
  { value: 'all', label: 'All Announcements', color: 'bg-blue-100 text-blue-800' },
  { value: 'members', label: 'Members Only', color: 'bg-green-100 text-green-800' },
  { value: 'public', label: 'Public', color: 'bg-purple-100 text-purple-800' },
  { value: 'admins', label: 'Admins Only', color: 'bg-red-100 text-red-800' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Announcements' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'recent', label: 'Recent' },
  { value: 'school', label: 'School' },
  { value: 'clubs', label: 'Clubs' },
];

// Loading Skeleton Component
function AnnouncementCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded flex-1"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
        <div className="h-9 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Announcement Card Component
function AnnouncementCard({ announcement, currentUser, onEdit, onDelete, onView }) {
  const canEdit = currentUser?.role === 'admin' || 
                  (currentUser?.role === 'club_admin' && announcement.club_id === currentUser.club_id);
  const canDelete = currentUser?.role === 'admin';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getTargetStyle = (target) => {
    const option = TARGET_OPTIONS.find(opt => opt.value === target);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const extractPlainText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
      announcement.is_pinned ? 'ring-2 ring-yellow-200 border-yellow-300' : ''
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {announcement.is_pinned && (
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {announcement.title}
            </h3>
          </div>
          <p className="text-sm text-blue-600 font-medium">
            {announcement.club_name || 'School Administration'}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTargetStyle(announcement.target)}`}>
          {TARGET_OPTIONS.find(opt => opt.value === announcement.target)?.label || announcement.target}
        </span>
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(announcement.created_at || new Date().toISOString())}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="capitalize">{announcement.target}</span>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
          {extractPlainText(announcement.content_html)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {/* View Details Button */}
        <Link
          to={`/announcements/${announcement.id}`}
          className="flex-1 px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center justify-center gap-2 no-underline"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>

        {/* Edit Button */}
        {canEdit && (
          <button
            onClick={() => onEdit(announcement.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={() => onDelete(announcement.id)}
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

export default function AnnouncementsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth:me'],
    queryFn: getCurrentUser,
  });

  const currentUser = useMemo(() => {
    if (!user) return null;
    const role = user.role_global === 'school_admin'
      ? 'admin'
      : user.club_id ? 'club_admin' : 'student';
    return { id: user.id, role, club_id: user.club_id };
  }, [user]);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["announcements:list"],
    queryFn: () => announcements.list(),
  });

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter and search announcements
  const filteredAnnouncements = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(announcement => 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (announcement.club_name && announcement.club_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        announcement.content_html.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    switch (filterType) {
      case 'pinned':
        filtered = filtered.filter(announcement => announcement.is_pinned);
        break;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(announcement => 
          new Date(announcement.created_at || announcement.updated_at) >= weekAgo
        );
        break;
      case 'school':
        filtered = filtered.filter(announcement => 
          announcement.club_id === 'school' || !announcement.club_id
        );
        break;
      case 'clubs':
        filtered = filtered.filter(announcement => 
          announcement.club_id && announcement.club_id !== 'school'
        );
        break;
      default:
        break;
    }

    // Sort: pinned first, then by date
    return filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      const aDate = new Date(a.created_at || a.updated_at || 0);
      const bDate = new Date(b.created_at || b.updated_at || 0);
      return bDate - aDate;
    });
  }, [data, searchQuery, filterType]);

  const { confirm, ConfirmDialog } = useConfirm();

  const handleEdit = (id) => {
    navigate(`/announcements/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (await confirm('Are you sure you want to delete this announcement?')) {
      // Handle delete logic - integrate with your API
      console.log('Delete announcement:', id);
    }
  };

  const handleCreate = () => {
    navigate('/announcements/new');
  };

  if (isLoading || isLoadingUser) {
    return (
      <>
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <AnnouncementCardSkeleton key={i} />
          ))}
        </div>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Megaphone className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading announcements</h3>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        </div>
      </>
    );
  }

  if (!data.length) {
    return (
      <>
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">
              Stay updated with the latest news and updates from school and clubs
            </p>
          </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Megaphone className="w-12 h-12 text-gray-400" />
          </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements</h3>
        <p className="text-gray-500 mb-6">No announcements are currently available.</p>
          {currentUser?.role === 'admin' && (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create First Announcement
            </button>
          )}
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">
          Stay updated with the latest news and updates from school and clubs
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
            placeholder="Search announcements..."
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

        {/* Create Announcement Button */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Announcement
          </button>
        )}
      </div>

      {/* Announcements Grid */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Megaphone className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters to find announcements.'
              : 'No announcements are currently available. Check back later for updates!'
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
          {filteredAnnouncements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredAnnouncements.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
    </>
  );
}