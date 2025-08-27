import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Heart,
  MessageCircle,
  Share,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from "@components/common/ui";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Mock data for joined clubs
  const joinedClubs = [
    {
      id: "1",
      name: "Basketball Club",
      image:
        "https://images.unsplash.com/photo-1720716430227-82ce7abf761d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMHNjaG9vbHxlbnwxfHx8fDE3NTU5Mjc5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Olahraga",
      status: "active",
      unreadCount: 3,
    },
    {
      id: "2",
      name: "Drama Club",
      image:
        "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGNsdWIlMjB0aGVhdGVyfGVufDF8fHx8MTc1NTkyNzkwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Seni",
      status: "active",
      unreadCount: 1,
    },
    {
      id: "3",
      name: "Science Lab",
      image:
        "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU1OTI3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Sains",
      status: "pending",
    },
  ];

  // Mock data for posts feed
  const feedPosts = [
    {
      id: "1",
      clubId: "1",
      clubName: "Basketball Club",
      clubImage:
        "https://images.unsplash.com/photo-1720716430227-82ce7abf761d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMHNjaG9vbHxlbnwxfHx8fDE3NTU5Mjc5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Sarah Chen",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108755-2616b68b7490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "2 hours ago",
      content:
        "Amazing practice session today! Our team chemistry is really improving. Can't wait for tomorrow's tournament! 🏀💪 #TeamWork #BasketballLife",
      image:
        "https://images.unsplash.com/photo-1703114608920-682133cc2ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwcHJhY3RpY2V8ZW58MXx8fHwxNzU1OTI4NzI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 24,
      comments: 8,
      isLiked: true,
    },
    {
      id: "2",
      clubId: "3",
      clubName: "Science Lab",
      clubImage:
        "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU1OTI3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Mike Johnson",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "5 hours ago",
      content:
        "Our chemistry project is coming along nicely! Working with acids and bases has been fascinating. Thanks to everyone who stayed late to help with the experiments. 🧪🔬",
      image:
        "https://images.unsplash.com/photo-1705727210721-961cc64a6895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzY2llbmNlJTIwcHJvamVjdHxlbnwxfHx8fDE3NTU5MzIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 15,
      comments: 3,
      isLiked: false,
    },
    {
      id: "3",
      clubId: "2",
      clubName: "Drama Club",
      clubImage:
        "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGNsdWIlMjB0aGVhdGVyfGVufDF8fHx8MTc1NTkyNzkwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Emma Davis",
      authorAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "1 day ago",
      content:
        "Rehearsal went amazing today! Our Romeo and Juliet performance is really coming together. The costumes arrived and they look incredible! 🎭✨ Opening night is next Friday - hope to see you all there!",
      image:
        "https://images.unsplash.com/photo-1748684050778-84709dc175a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMHRoZWF0ZXIlMjBzdHVkZW50c3xlbnwxfHx8fDE3NTU5MzIxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 32,
      comments: 12,
      isLiked: false,
    },
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Basketball Tournament",
      clubName: "Basketball Club",
      date: "Today",
      time: "15:00 - 17:00",
      location: "Sports Hall",
      status: "today",
    },
    {
      id: "2",
      title: "Drama Performance",
      clubName: "Drama Club",
      date: "Tomorrow",
      time: "19:00 - 21:00",
      location: "Theater",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Science Fair",
      clubName: "Science Lab",
      date: "30 Aug",
      time: "10:00 - 16:00",
      location: "Main Hall",
      status: "upcoming",
    },
  ];

  // Mock data for club recommendations
  const clubRecommendations = [
    {
      id: "4",
      name: "Photography Club",
      image:
        "https://images.unsplash.com/photo-1574465636377-7781c5117a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdHVkZW50cyUyMGdyb3VwfGVufDF8fHx8MTc1NTkzMjEwNnww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Seni",
      memberCount: 16,
      matchPercentage: 92,
    },
    {
      id: "5",
      name: "Robotics Club",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyb2JvdGljcyUyMHN0dWRlbnRzfGVufDF8fHx8MTc1NTkzMjExN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Teknologi",
      memberCount: 12,
      matchPercentage: 88,
    },
  ];

  const handleLike = (postId) => {
    console.log("Liked post:", postId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="size-3 text-[#16A34A]" />;
      case "pending":
        return <AlertCircle className="size-3 text-[#EAB308]" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content - Three Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - My Clubs */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>My Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {joinedClubs.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/clubs/${club.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={club.image}
                          alt={club.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        {club.unreadCount && (
                          <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-xs rounded-full size-5 flex items-center justify-center">
                            {club.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{club.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getStatusIcon(club.status)}
                          <span>{getStatusText(club.status)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  className="w-full text-[#2563EB] border-[#2563EB] hover:bg-blue-50"
                >
                  <Plus className="size-4 mr-2" />
                  Join More Clubs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Feed */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={post.authorAvatar}
                          alt={post.author}
                        />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{post.author}</p>
                          <Badge variant="secondary" className="text-xs">
                            {post.clubName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {post.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <div className="px-6 pb-3">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="w-full">
                      <img
                        src={post.image}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <CardContent className="pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 p-2 hover:bg-red-50 hover:text-red-600"
                        >
                          <Heart
                            className={`size-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                          />
                          <span className="text-sm">{post.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 p-2 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <MessageCircle className="size-4" />
                          <span className="text-sm">{post.comments}</span>
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Share className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#2563EB]">
                      {joinedClubs.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined Clubs
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#16A34A]">
                      {upcomingEvents.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upcoming Events
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">156</p>
                    <p className="text-xs text-muted-foreground">
                      Activity Points
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#EAB308]">4</p>
                    <p className="text-xs text-muted-foreground">
                      Achievements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <Calendar
                        className={`size-4 mt-0.5 ${
                          event.status === "today"
                            ? "text-[#DC2626]"
                            : "text-[#2563EB]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.clubName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>
                              {event.date} • {event.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Club Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clubRecommendations.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    >
                      <img
                        src={club.image}
                        alt={club.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{club.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {club.category}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {club.memberCount} members
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-[#16A34A]/10 text-[#16A34A]"
                          >
                            {club.matchPercentage}% match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 text-[#2563EB] border-[#2563EB] hover:bg-blue-50"
                >
                  View All Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
