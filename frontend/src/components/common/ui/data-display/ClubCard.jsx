import { Users, MapPin } from "lucide-react";
import { Button } from "../forms/Button.jsx";
import { Badge } from "./Badge.jsx";
import { ImageWithFallback } from "./ImageWithFallback.jsx";

export function ClubCard({
  id,
  name,
  image,
  memberCount,
  category,
  description,
  location,
  isJoined = false,
  onViewProfile,
}) {
  const handleCardClick = () => {
    if (onViewProfile) {
      onViewProfile(id);
    }
  };

  return (
    <div
      className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-40 object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-white/90 text-foreground hover:bg-white/90">
          {category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-medium mb-2 line-clamp-1">{name}</h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{memberCount} members</span>
          </div>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <Button
          className={`w-full ${
            isJoined
              ? "bg-[#16A34A] hover:bg-green-700"
              : "bg-[#2563EB] hover:bg-blue-700"
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is clicked
          }}
        >
          {isJoined ? "JOINED" : "JOIN"}
        </Button>
      </div>
    </div>
  );
}
