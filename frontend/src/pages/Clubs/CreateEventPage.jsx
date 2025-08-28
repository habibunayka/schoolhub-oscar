import { useState, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
  Bold,
  Italic,
  List,
  Save,
} from "lucide-react";

export default function CreateEventPage() {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    club: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: "",
    requiresRSVP: true,
    isPublic: true,
    image: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      handleInputChange("image", result);
    };
    reader.readAsDataURL(file);
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
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSave = () => {
    console.log("Saving event:", formData);
    alert("Event saved successfully!");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    alert("Draft saved successfully!");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr;
  };

  // TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan.
  const clubOptions = [
    { value: "basketball", label: "Basketball Club" },
    { value: "drama", label: "Drama Club" },
    { value: "science", label: "Science Lab" },
    { value: "debate", label: "Debate Society" },
    { value: "programming", label: "Programming Club" },
    { value: "music", label: "Music Ensemble" },
  ];

  const getClubLabel = (value) => {
    const club = clubOptions.find(option => option.value === value);
    return club ? club.label : value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGoBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Create Event</h1>
                <p className="text-sm text-gray-600">
                  Design and publish a new event
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                Publish Event
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Panel - 60% on desktop, full width on mobile */}
          <div className="lg:col-span-3 space-y-8">
            {/* Basic Info Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="club" className="block text-sm font-medium text-gray-700">
                    Organizing Club
                  </label>
                  <select
                    id="club"
                    value={formData.club}
                    onChange={(e) => handleInputChange("club", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                  >
                    <option value="">Select organizing club</option>
                    {clubOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rich Text Editor for Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="border border-gray-300 rounded-lg bg-white">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors duration-200">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors duration-200">
                        <Italic className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors duration-200">
                        <List className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button className="p-2 hover:bg-gray-200 rounded transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      id="description"
                      placeholder="Describe your event in detail..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full p-3 border-0 bg-transparent resize-none min-h-32 focus:outline-none"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Event Image</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {formData.image ? (
                      <div className="space-y-2">
                        <img
                          src={formData.image}
                          alt="Event preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <div>
                          <p className="text-sm">
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-700 underline"
                            >
                              Click to upload
                            </button>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity (Optional)
                  </label>
                  <input
                    id="capacity"
                    type="number"
                    placeholder="Maximum number of attendees"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Require RSVP</label>
                    <p className="text-sm text-gray-500">
                      Attendees must confirm their attendance
                    </p>
                  </div>
                  <button
                    onClick={() => handleInputChange("requiresRSVP", !formData.requiresRSVP)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.requiresRSVP ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.requiresRSVP ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Public Event</label>
                    <p className="text-sm text-gray-500">
                      Visible to all students in the school
                    </p>
                  </div>
                  <button
                    onClick={() => handleInputChange("isPublic", !formData.isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.isPublic ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden flex gap-2">
              <button 
                onClick={handleSaveDraft}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                Publish Event
              </button>
            </div>
          </div>

          {/* Preview Panel - 40% on desktop, full width below form on mobile */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </h2>
                </div>
                <div className="p-6">
                  {/* Event Card Preview */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="relative">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Event preview"
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {formData.club && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                          {getClubLabel(formData.club)}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium mb-2 text-gray-900">
                        {formData.title || "Event Title"}
                      </h3>

                      {formData.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {formData.description.length > 100 
                            ? `${formData.description.substring(0, 100)}...` 
                            : formData.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-gray-600">
                        {formData.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(formData.date)}</span>
                          </div>
                        )}
                        {(formData.startTime || formData.endTime) && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(formData.startTime)}
                              {formData.startTime && formData.endTime && " - "}
                              {formatTime(formData.endTime)}
                            </span>
                          </div>
                        )}
                        {formData.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{formData.location}</span>
                          </div>
                        )}
                        {formData.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Max {formData.capacity} attendees</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed"
                          disabled
                        >
                          {formData.requiresRSVP ? "RSVP" : "Join Event"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Event Settings Summary */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 text-gray-900">Event Settings</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>
                        • RSVP: {formData.requiresRSVP ? "Required" : "Not required"}
                      </div>
                      <div>
                        • Visibility: {formData.isPublic ? "Public" : "Private"}
                      </div>
                      {formData.capacity && (
                        <div>• Capacity: {formData.capacity} attendees</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}