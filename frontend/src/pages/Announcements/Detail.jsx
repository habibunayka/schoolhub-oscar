import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Edit, ChevronRight, Megaphone } from 'lucide-react';
import announcements from '@services/announcements.js';
import { me as getCurrentUser } from '@services/auth.js';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcements', id],
    queryFn: () => announcements.get(id),
  });

  const { data: user } = useQuery({
    queryKey: ['auth:me'],
    queryFn: getCurrentUser,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Megaphone className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {error ? 'Error loading announcement' : 'Announcement not found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {error ? 'Please try again later.' : "The announcement you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/announcements')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Announcements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate('/announcements')}
          className="hover:text-blue-600 transition-colors duration-200"
        >
          Announcements
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 truncate">{data.title}</span>
      </nav>

      {/* Announcement Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          <Calendar className="w-4 h-4 inline-block mr-1 align-text-top" />
          Published {formatDate(data.created_at)}
        </p>

        <div
          className="prose prose-lg max-w-none text-left prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: data.content_html }}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center gap-3">
          <button
            onClick={() => navigate('/announcements')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Back to List
          </button>
          {user?.role_global === 'school_admin' && (
            <button
              onClick={() => navigate(`/announcements/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
