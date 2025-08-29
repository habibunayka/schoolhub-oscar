import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Edit, ChevronRight, Megaphone } from 'lucide-react';
import announcements from "@services/announcements.js";

const TARGET_OPTIONS = [
  { value: 'all', label: 'All Announcements', color: 'bg-blue-100 text-blue-800' },
  { value: 'members', label: 'Members Only', color: 'bg-green-100 text-green-800' },
  { value: 'public', label: 'Public', color: 'bg-purple-100 text-purple-800' },
  { value: 'admins', label: 'Admins Only', color: 'bg-red-100 text-red-800' },
];

export default function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcements.get(id),
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTargetStyle = (target) => {
    const option = TARGET_OPTIONS.find(opt => opt.value === target);
    return option ? option.color : 'bg-gray-100 text-gray-800';
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
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {data.is_pinned && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
              </div>
              <p className="text-lg text-blue-600 font-medium">
                {data.club_name || 'School Administration'}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTargetStyle(data.target)}`}>
              {TARGET_OPTIONS.find(opt => opt.value === data.target)?.label || data.target}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Published {formatDate(data.created_at)}</span>
            </div>
            {data.updated_at && data.updated_at !== data.created_at && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(data.updated_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: data.content_html }}
        />

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => navigate('/announcements')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Back to List
          </button>
          
          {/* Show edit button if user has permission */}
          <button
            onClick={() => navigate(`/announcements/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </article>
    </div>
  );
}