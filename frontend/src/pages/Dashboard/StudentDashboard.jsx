// src/pages/StudentDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Separator,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/common/ui";
import EmptyState from "@components/common/EmptyState";
import SafeImage from "@components/SafeImage";
import { getInitials } from "@utils/string";
import {
  getJoinedClubs,
  getClubRecommendations,
} from "@services/clubs.js";
import { getFeedPosts } from "@services/posts.js";
import { getUpcomingEvents } from "@services/events.js";
import { getUserStats } from "@services/users.js";
import { getAssetUrl } from "@utils";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [errClubs, setErrClubs] = useState(null);

  const [feedPosts, setFeedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [errPosts, setErrPosts] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errEvents, setErrEvents] = useState(null);

  const [clubRecommendations, setClubRecommendations] = useState([]);
  const [loadingRecom, setLoadingRecom] = useState(true);
  const [errRecom, setErrRecom] = useState(null);
  const [activityPoints, setActivityPoints] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(0);

  const normalizeClub = (c) => ({
    id: String(c.id),
    name: c.name ?? c.club_name,
    image: getAssetUrl(c.logo_url ?? c.image_url ?? null),
    category: c.category_name ?? c.category ?? c.type ?? "Unknown",
    status: c.status ?? c.membership_status ?? "active",
    unreadCount: c.unread_count ?? 0,
  });

  const normalizePost = (p) => ({
    id: String(p.id),
    clubId: String(p.club_id),
    clubName: p.club_name ?? p.club?.name,
    clubImage: getAssetUrl(p.club_image ?? p.club?.logo_url ?? null),
    author: p.author_name ?? p.author?.name,
    authorAvatar: getAssetUrl(p.author_avatar ?? p.author?.avatar_url ?? null),
    timestamp: p.created_at,
    content: p.body_text ?? p.body ?? p.content,
    images: Array.isArray(p.images)
      ? p.images.map(getAssetUrl)
      : p.image_url
        ? [getAssetUrl(p.image_url)]
        : [],
    likes: p.likes_count ?? 0,
    comments: p.comments_count ?? 0,
    isLiked: !!p.liked,
  });

  const normalizeEvent = (e) => ({
    id: String(e.id),
    title: e.title ?? e.name,
    clubName: e.club_name ?? e.club?.name,
    date: e.date ?? e.start_time,
    time: e.time ?? `${e.start_time} - ${e.end_time}`,
    location: e.location ?? e.place ?? "-",
    status: e.status ?? "upcoming",
  });

  const normalizeRecom = (c) => ({
    id: String(c.id),
    name: c.name,
    image: getAssetUrl(c.logo_url ?? c.image_url ?? null),
    category: c.category_name ?? c.category ?? "Lainnya",
    memberCount: c.member_count ?? 0,
    matchPercentage: c.match ?? c.score ?? 0,
  });

  useEffect(() => {
    (async () => {
      setLoadingClubs(true);
      try {
        const raw = await getJoinedClubs();
        setJoinedClubs(Array.isArray(raw) ? raw.map(normalizeClub) : []);
        const stats = await getUserStats();
        setActivityPoints(stats?.activity_points ?? 0);
        setAchievementsCount(stats?.achievements_count ?? 0);
      } catch (e) {
        setErrClubs(e?.response?.data?.message || e.message);
      } finally {
        setLoadingClubs(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!joinedClubs.length) return;
    const firstId = joinedClubs[0].id;
    (async () => {
      setLoadingPosts(true);
      setLoadingEvents(true);
      try {
        const postsRaw = await getFeedPosts(firstId);
        setFeedPosts(Array.isArray(postsRaw) ? postsRaw.map(normalizePost) : []);
      } catch (e) {
        setErrPosts(e?.response?.data?.message || e.message);
      } finally {
        setLoadingPosts(false);
      }
      try {
        const eventsRaw = await getUpcomingEvents(firstId);
        setUpcomingEvents(Array.isArray(eventsRaw) ? eventsRaw.map(normalizeEvent) : []);
      } catch (e) {
        setErrEvents(e?.response?.data?.message || e.message);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, [joinedClubs]);

  useEffect(() => {
    (async () => {
      setLoadingRecom(true);
      try {
        const raw = await getClubRecommendations();
        setClubRecommendations(
          Array.isArray(raw) ? raw.map(normalizeRecom) : []
        );
      } catch (e) {
        setErrRecom(e?.response?.data?.message || e.message);
      } finally {
        setLoadingRecom(false);
      }
    })();
  }, []);

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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - My Clubs */}
          <div className="lg:col-span-3">
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>My Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loadingClubs ? (
                    <p>Loading...</p>
                  ) : errClubs ? (
                    <p className="text-red-500">{errClubs}</p>
                  ) : !joinedClubs.length ? (
                    <EmptyState message="No clubs joined" />
                  ) : (
                    joinedClubs.map((club) => (
                      <div
                        key={club.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/clubs/${club.id}`)}
                      >
                        <div className="relative">
                          <SafeImage
                            src={club.image}
                            alt={club.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            sizePx={64}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{club.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getStatusIcon(club.status)}
                            <span>{getStatusText(club.status)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Separator className="my-4" />

                <Button
                  onClick={() => navigate("/clubs")}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
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
              {loadingPosts ? (
                <p>Loading...</p>
              ) : errPosts ? (
                <p className="text-red-500">{errPosts}</p>
              ) : !feedPosts.length ? (
                <EmptyState message="No posts available" />
              ) : (
                feedPosts.map((post) => (
                  <Card key={post.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {/* use SafeImage inside Avatar to avoid broken avatar */}
                          <SafeImage
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                            sizePx={64}
                          />
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

                    {post.images.length > 0 && (
                      post.images.length === 1 ? (
                        <div className="w-full">
                          <SafeImage
                            src={post.images[0]}
                            alt="Post content"
                            className="w-full h-64 object-cover"
                            sizePx={640}
                          />
                        </div>
                      ) : (
                        <Carousel className="w-full">
                          <CarouselContent>
                            {post.images.map((img, idx) => (
                              <CarouselItem key={idx}>
                                <SafeImage
                                  src={img}
                                  alt={`Post image ${idx + 1}`}
                                  className="w-full h-64 object-cover"
                                  sizePx={640}
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      )
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
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
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
                    <p className="text-2xl font-bold text-[#F97316]">
                      {activityPoints}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Activity Points
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#EAB308]">
                      {achievementsCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Achievements
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loadingEvents ? (
                    <p>Loading...</p>
                  ) : errEvents ? (
                    <p className="text-red-500">{errEvents}</p>
                  ) : !upcomingEvents.length ? (
                    <EmptyState message="No upcoming events" />
                  ) : (
                    upcomingEvents.map((event) => (
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
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Club Recommendations */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Recommended Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loadingRecom ? (
                    <p>Loading...</p>
                  ) : errRecom ? (
                    <p className="text-red-500">{errRecom}</p>
                  ) : !clubRecommendations.length ? (
                    <EmptyState message="No recommendations" />
                  ) : (
                    clubRecommendations.map((club) => (
                      <div
                        key={club.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border"
                      >
                        <SafeImage
                          src={club.image}
                          alt={club.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          sizePx={64}
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
                    ))
                  )}
                </div>

                <Button
                  onClick={() => navigate("/clubs")}
                  className="w-full mt-4 bg-blue-600 text-white"
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
