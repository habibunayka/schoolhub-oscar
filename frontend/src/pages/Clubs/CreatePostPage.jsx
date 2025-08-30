import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, 
  Upload, 
  Save, 
  X, 
  Image as ImageIcon, 
  FileText,
  Users,
  Globe,
  Lock,
  ChevronDown,
  Trash2
} from "lucide-react";
import { me as getCurrentUser } from "@services/auth.js";
import { createPost } from "@services/posts.js";
import useConfirm from "@hooks/useConfirm.jsx";

// Restrict page to club admin role

const VISIBILITY_OPTIONS = [
  { 
    value: 'public', 
    label: 'Public', 
    description: 'Anyone can see this post',
    icon: Globe,
    color: 'text-green-600'
  },
  {
    value: 'members_only',
    label: 'Members Only',
    description: 'Only club members can see this',
    icon: Users,
    color: 'text-blue-600'
  },
  { 
    value: 'private', 
    label: 'Private', 
    description: 'Only admins can see this',
    icon: Lock,
    color: 'text-red-600'
  }
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  
  const [formData, setFormData] = useState({ 
    content: "", 
    images: [],
    visibility: 'public',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const { confirm, ConfirmDialog } = useConfirm();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth:me'],
    queryFn: getCurrentUser,
  });

  if (isLoadingUser) return <div className="p-4">Loading...</div>;
  if (!user?.club_id || user.role_global === 'school_admin') {
    return <div className="p-4">Unauthorized</div>;
  }

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only images under 5MB are allowed.");
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, { 
              id: Date.now() + Math.random(),
              url: result,
              file: file,
              name: file.name
            }],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e) => {
    handleFiles(e.target.files ?? []);
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors.content = 'Post content is required';
    }
    
    if (formData.content.length > 2000) {
      newErrors.content = 'Post content must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPublishing(true);

    try {
      const payload = {
        body_html: formData.content.replace(/\n/g, "<br>"),
        visibility: formData.visibility,
        images: formData.images.map((img) => img.file),
      };
      const { id: postId } = await createPost(id, payload);
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGoBack = async () => {
    if (formData.content.trim() || formData.images.length > 0) {
      if (await confirm('You have unsaved changes. Are you sure you want to go back?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const selectedVisibility = VISIBILITY_OPTIONS.find(opt => opt.value === formData.visibility);

  return (
    <>
    <ConfirmDialog />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                disabled={isPublishing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Create Post</h1>
                <p className="text-sm text-gray-600">Share an update with your community</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Visibility Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <selectedVisibility.icon className={`w-4 h-4 ${selectedVisibility.color}`} />
                  <span className="text-sm">{selectedVisibility.label}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {showVisibilityDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                    {VISIBILITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, visibility: option.value }));
                          setShowVisibilityDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <option.icon className={`w-5 h-5 mt-0.5 ${option.color}`} />
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish Button */}
              <button
                onClick={handleSave}
                disabled={isPublishing || !formData.content.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {!isPublishing && <Save className="w-4 h-4" />}
                {isPublishing ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, content: e.target.value }));
                  if (errors.content) {
                    setErrors(prev => ({ ...prev, content: null }));
                  }
                }}
                placeholder="Share your thoughts, updates, or announcements..."
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.content ? (
                  <p className="text-sm text-red-600">{errors.content}</p>
                ) : (
                  <div></div>
                )}
                <span className={`text-xs ${
                  formData.content.length > 2000 ? 'text-red-500' : 
                  formData.content.length > 1800 ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {formData.content.length}/2000
                </span>
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver 
                    ? "border-blue-400 bg-blue-50" 
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Drag and drop images here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      or click to browse your files
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {formData.images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={`Preview ${img.name}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                            {img.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Post Preview */}
            {(formData.content.trim() || formData.images.length > 0) && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Post Preview
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">You</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">Your Name</span>
                        <span className="text-xs text-gray-500">Just now</span>
                        <div className="flex items-center gap-1">
                          <selectedVisibility.icon className={`w-3 h-3 ${selectedVisibility.color}`} />
                          <span className="text-xs text-gray-500">{selectedVisibility.label}</span>
                        </div>
                      </div>
                      {formData.content.trim() && (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                          {formData.content}
                        </p>
                      )}
                      {formData.images.length > 0 && (
                        <div className={`grid gap-2 ${
                          formData.images.length === 1 ? 'grid-cols-1' :
                          formData.images.length === 2 ? 'grid-cols-2' :
                          'grid-cols-2 md:grid-cols-3'
                        }`}>
                          {formData.images.slice(0, 6).map((img, idx) => (
                            <div key={img.id} className="relative">
                              <img
                                src={img.url}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-32 object-cover rounded"
                              />
                              {idx === 5 && formData.images.length > 6 && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                                  <span className="text-white font-medium">
                                    +{formData.images.length - 6} more
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showVisibilityDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowVisibilityDropdown(false)}
        />
      )}
    </div>
    </>
  );
}