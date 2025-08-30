import { Heart, MessageCircle, Share } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Avatar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/common/ui";
import SafeImage from "@components/SafeImage";

export default function PostCard({ post, onLike, onComment, onShare, hideActions = false }) {
  if (!post) return null;
  const {
    id,
    author,
    authorAvatar,
    timestamp,
    caption,
    content,
    images = [],
    likes = 0,
    comments = 0,
    isLiked = false,
    clubName,
  } = post;
  const text = caption ?? content ?? "";

  return (
    <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <SafeImage
              src={authorAvatar}
              alt={author}
              className="w-10 h-10 rounded-full object-cover"
              sizePx={64}
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{author}</p>
              {clubName && (
                <Badge variant="secondary" className="text-xs">
                  {clubName}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </CardHeader>

      {text && (
        <div className="px-6 pb-3">
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
      )}

      {images.length > 0 && (
        images.length === 1 ? (
          <div className="w-full">
            <SafeImage
              src={images[0]}
              alt="Post content"
              className="w-full h-80 object-cover"
              sizePx={800}
            />
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <SafeImage
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-80 object-cover"
                    sizePx={800}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )
      )}

      {!hideActions && (
        <CardContent className="pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(id)}
                className="flex items-center gap-2 p-2"
              >
                <Heart className={`size-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span className="text-sm">{likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(id)}
                className="flex items-center gap-2 p-2"
              >
                <MessageCircle className="size-4" />
                <span className="text-sm">{comments}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => onShare?.(id)}
            >
              <Share className="size-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

