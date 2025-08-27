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
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Badge } from "@components/ui/badge";
import { ImageWithFallback } from "@components/ui/ImageWithFallback";

export default function CreateEventPage({ onBack, onSave }) {
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
    onSave(formData);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-bold text-xl">Create Event</h1>
                <p className="text-sm text-muted-foreground">
                  Design and publish a new event
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#2563EB] hover:bg-blue-700"
              >
                Publish Event
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Panel - 60% on desktop, full width on mobile */}
          <div className="lg:col-span-3 space-y-8">
            {/* Basic Info Section */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club">Organizing Club</Label>
                  <Select
                    value={formData.club}
                    onValueChange={(value) => handleInputChange("club", value)}
                  >
                    <SelectTrigger className="bg-input-background border-border">
                      <SelectValue placeholder="Select organizing club" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">
                        Basketball Club
                      </SelectItem>
                      <SelectItem value="drama">Drama Club</SelectItem>
                      <SelectItem value="science">Science Lab</SelectItem>
                      <SelectItem value="debate">Debate Society</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rich Text Editor for Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="border border-border rounded-lg bg-input-background">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-border">
                      <Button variant="ghost" size="sm">
                        <Bold className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Italic className="size-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <List className="size-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <Button variant="ghost" size="sm">
                        <Eye className="size-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Describe your event in detail..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="border-0 bg-transparent resize-none min-h-32"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Event Image</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver
                        ? "border-[#2563EB] bg-blue-50"
                        : "border-border hover:border-[#2563EB]/50"
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="size-8 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            <Button
                              variant="link"
                              className="p-0 h-auto text-[#2563EB]"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Click to upload
                            </Button>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
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
              </CardContent>
            </Card>

            {/* Date & Time Section */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        handleInputChange("startTime", e.target.value)
                      }
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        handleInputChange("endTime", e.target.value)
                      }
                      className="bg-input-background border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="bg-input-background border-border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Optional)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Maximum number of attendees"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                    className="bg-input-background border-border"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require RSVP</Label>
                    <p className="text-sm text-muted-foreground">
                      Attendees must confirm their attendance
                    </p>
                  </div>
                  <Switch
                    checked={formData.requiresRSVP}
                    onCheckedChange={(checked) =>
                      handleInputChange("requiresRSVP", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Public Event</Label>
                    <p className="text-sm text-muted-foreground">
                      Visible to all students in the school
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublic", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mobile Action Buttons */}
            <div className="lg:hidden flex gap-2">
              <Button variant="outline" className="flex-1">
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#2563EB] hover:bg-blue-700"
              >
                Publish Event
              </Button>
            </div>
          </div>

          {/* Preview Panel - 40% on desktop, full width below form on mobile */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="size-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Event Card Preview */}
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="relative">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Event preview"
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-muted flex items-center justify-center">
                          <Upload className="size-8 text-muted-foreground" />
                        </div>
                      )}
                      {formData.club && (
                        <Badge className="absolute top-2 left-2 bg-[#F97316] text-white hover:bg-orange-600">
                          {formData.club === "basketball"
                            ? "Basketball Club"
                            : formData.club === "drama"
                              ? "Drama Club"
                              : formData.club === "science"
                                ? "Science Lab"
                                : formData.club === "debate"
                                  ? "Debate Society"
                                  : formData.club}
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium mb-2">
                        {formData.title || "Event Title"}
                      </h3>

                      {formData.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {formData.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-muted-foreground">
                        {formData.date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>{formatDate(formData.date)}</span>
                          </div>
                        )}
                        {(formData.startTime || formData.endTime) && (
                          <div className="flex items-center gap-2">
                            <Clock className="size-4" />
                            <span>
                              {formatTime(formData.startTime)}
                              {formData.startTime && formData.endTime && " - "}
                              {formatTime(formData.endTime)}
                            </span>
                          </div>
                        )}
                        {formData.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            <span>{formData.location}</span>
                          </div>
                        )}
                        {formData.capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>Max {formData.capacity} attendees</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Button
                          className="w-full bg-[#2563EB] hover:bg-blue-700"
                          disabled
                        >
                          {formData.requiresRSVP ? "RSVP" : "Join Event"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Event Settings Summary */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Event Settings</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        • RSVP:{" "}
                        {formData.requiresRSVP ? "Required" : "Not required"}
                      </div>
                      <div>
                        • Visibility: {formData.isPublic ? "Public" : "Private"}
                      </div>
                      {formData.capacity && (
                        <div>• Capacity: {formData.capacity} attendees</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
