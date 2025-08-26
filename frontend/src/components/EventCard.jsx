import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function EventCard({ 
  title, 
  clubName, 
  date, 
  time, 
  location, 
  image,
  attendeeCount = 0,
  isRSVPed = false 
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-32 object-cover"
        />
        <Badge 
          className="absolute top-2 left-2 bg-[#F97316] text-white hover:bg-orange-600"
        >
          {clubName}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium mb-2 line-clamp-1">{title}</h3>
        
        <div className="space-y-2 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {attendeeCount > 0 && (
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>{attendeeCount} attending</span>
            </div>
          )}
        </div>
        
        <Button 
          variant={isRSVPed ? "secondary" : "default"}
          className={`w-full ${
            !isRSVPed && "bg-[#2563EB] hover:bg-blue-700"
          }`}
        >
          {isRSVPed ? "RSVP'd" : "RSVP"}
        </Button>
      </div>
    </div>
  );
}