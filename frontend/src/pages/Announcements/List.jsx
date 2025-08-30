import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye, Megaphone } from 'lucide-react';
import announcements from '@services/announcements.js';
import { me as getCurrentUser } from '@services/auth.js';
import useConfirm from '@hooks/useConfirm.jsx';

function AnnouncementCard({ announcement, currentUser, onEdit, onDelete }) {
  const canEdit = currentUser?.role === 'admin';
  const canDelete = currentUser?.role === 'admin';

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const extractPlainText = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{formatDate(announcement.created_at || announcement.updated_at)}</p>
      <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-4">{extractPlainText(announcement.content_html)}</p>
      <div className="flex justify-center gap-2">
        <Link
          to={`/announcements/${announcement.id}`}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 no-underline"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        {canEdit && (
          <button
            onClick={() => onEdit(announcement.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(announcement.id)}
            className="px-4 py-2 rounded-lg font-medium text-sm border border-red-300 text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth:me'],
    queryFn: getCurrentUser,
  });

  const currentUser = useMemo(() => {
    if (!user) return null;
    const role = user.role_global === 'school_admin' ? 'admin' : 'student';
    return { id: user.id, role };
  }, [user]);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['announcements:list', searchQuery],
    queryFn: () => announcements.list({ search: searchQuery }),
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { confirm, ConfirmDialog } = useConfirm();

  const handleEdit = (id) => navigate(`/announcements/${id}/edit`);
  const handleDelete = async (id) => {
    if (await confirm('Are you sure you want to delete this announcement?')) {
      console.log('Delete announcement:', id);
    }
  };
  const handleCreate = () => navigate('/announcements/new');

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content_html.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (isLoading || isLoadingUser) {
    return (
      <>
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
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

  return (
    <>
      <ConfirmDialog />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Stay updated with the latest school announcements</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Megaphone className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search to find announcements.' : 'No announcements are currently available. Check back later for updates!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement) => (
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

        {filteredAnnouncements.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </>
  );
}
