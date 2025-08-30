import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Save, X } from 'lucide-react';
import announcements from "@services/announcements.js";
import { me as getCurrentUser } from "@services/auth.js";

// Restrict access to school admins only

const TARGET_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'members', label: 'Members Only' },
  { value: 'public', label: 'Public' },
  { value: 'admins', label: 'Admins Only' },
];

export default function AnnouncementForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth:me"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (!isLoadingUser && user?.role_global !== 'school_admin') {
      navigate('/');
    }
  }, [user, isLoadingUser, navigate]);

  const { data, isLoading: isLoadingData } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcements.get(id),
    enabled: editing,
  });

  const [form, setForm] = useState({
    club_id: "",
    title: "",
    content_html: "",
    target: "all",
    is_pinned: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setForm({
        club_id: data.club_id || "",
        title: data.title || "",
        content_html: data.content_html || "",
        target: data.target || "all",
        is_pinned: data.is_pinned || false
      });
    }
  }, [data]);

  useEffect(() => {
    if (user?.role_global === 'school_admin' && !editing) {
      setForm((prev) => ({ ...prev, club_id: 'school' }));
    }
  }, [user, editing]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      editing ? announcements.update(id, payload) : announcements.create(payload),
    onSuccess: () => {
      qc.invalidateQueries(["announcements:list"]);
      qc.invalidateQueries(["announcements", id]);
      navigate("/announcements");
    },
    onError: (error) => {
      console.error('Error saving announcement:', error);
      // Handle validation errors if your API returns them
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!form.content_html.trim()) {
      newErrors.content_html = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    mutation.mutate(form);
  };

  if (isLoadingUser || (editing && isLoadingData)) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
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
        <span className="text-gray-900">{editing ? 'Edit' : 'Create'} Announcement</span>
      </nav>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {editing ? 'Edit Announcement' : 'Create New Announcement'}
          </h1>
          <p className="text-gray-600">
            {editing ? 'Update your announcement details below.' : 'Share important information with your community.'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="Enter announcement title"
              value={form.title}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              name="target"
              value={form.target}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
            >
              {TARGET_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose who can see this announcement
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content_html"
              placeholder="Write your announcement content here..."
              value={form.content_html}
              onChange={onChange}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical ${
                errors.content_html ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content_html && (
              <p className="mt-1 text-sm text-red-600">{errors.content_html}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/announcements')}
              disabled={mutation.isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {!mutation.isLoading && <Save className="w-4 h-4" />}
              {mutation.isLoading 
                ? (editing ? 'Updating...' : 'Creating...') 
                : (editing ? 'Update Announcement' : 'Create Announcement')
              }
            </button>
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                {mutation.error?.message || 'An error occurred while saving the announcement. Please try again.'}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}