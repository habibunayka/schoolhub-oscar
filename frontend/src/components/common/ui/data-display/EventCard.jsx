import { Calendar, Clock, MapPin, Users, Globe, Lock } from "lucide-react";
import { Button } from "../forms/Button.jsx";
import { Badge } from "./Badge.jsx";
import SafeImage from "@components/SafeImage";

export function EventCard({
  title,
  clubName,
  date,
  time,
  location,
  image,
  attendeeCount = 0,
  isRSVPed = false,
  description,
  visibility,
  hideButton = false,
}) {
  const visibilityMap = {
    public: { icon: Globe, color: "text-green-600", label: "Public" },
    private: { icon: Lock, color: "text-red-600", label: "Private" },
  };
  const visibilityData = visibility ? visibilityMap[visibility] : null;
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <SafeImage
          src={image}
          alt={title}
          className="w-full h-32 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-[#F97316] text-white hover:bg-orange-600">
          {clubName}
        </Badge>
        {visibilityData && (
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow flex items-center gap-1">
            <visibilityData.icon className={`w-4 h-4 ${visibilityData.color}`} />
            <span className="text-xs font-medium text-gray-600">{visibilityData.label}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-2 line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {description}
          </p>
        )}

        {(date || time || location || attendeeCount > 0) && (
          <div className="space-y-2 mb-3 text-sm text-muted-foreground">
            {date && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{time}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
            {attendeeCount > 0 && (
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>{attendeeCount} attending</span>
              </div>
            )}
          </div>
        )}

        {!hideButton && (
          <Button
            variant={isRSVPed ? "secondary" : "default"}
            className={`w-full ${!isRSVPed && "bg-[#2563EB] hover:bg-blue-700"}`}
          >
            {isRSVPed ? "RSVP'd" : "RSVP"}
          </Button>
        )}
      </div>
    </div>
  );
}
