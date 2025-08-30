// src/pages/StudentDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@components/common/ui";
import EmptyState from "@components/common/EmptyState";
import SafeImage from "@components/SafeImage";
import {
  getJoinedClubs,
  getClubRecommendations,
} from "@services/clubs.js";
import { getFeedPosts, likePost, unlikePost } from "@services/posts.js";
import { getUpcomingEvents } from "@services/events.js";
import { getUserStats } from "@services/users.js";
import { getAssetUrl, formatDate, formatTime } from "@utils";
import PostCard from "@components/posts/PostCard.jsx";
import { me as getCurrentUser } from "@services/auth.js";

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
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);

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
    content: p.body_html
      ? p.body_html.replace(/<[^>]*>/g, "")
      : p.body_text ?? p.body ?? p.content ?? "",
    images: Array.isArray(p.images)
      ? p.images.map((img) => getAssetUrl(img))
      : p.image_url
        ? [getAssetUrl(p.image_url)]
        : [],
    likes: p.likes_count ?? 0,
    comments: p.comments_count ?? 0,
    isLiked: !!p.liked,
  });

  const normalizeEvent = (e) => {
    const start = e.start_at || e.start_time || e.date;
    const end = e.end_at || e.end_time;
    const date = formatDate(start);
    const startTime = formatTime(start);
    const endTime = end ? formatTime(end) : "";
    const time = endTime ? `${startTime} - ${endTime}` : startTime;
    let status = e.status;
    if (!status && start) {
      const now = new Date();
      const startDate = new Date(start);
      status = startDate.toDateString() === now.toDateString()
        ? "today"
        : startDate < now
          ? "past"
          : "upcoming";
    }
    return {
      id: String(e.id),
      title: e.title ?? e.name,
      clubName: e.club_name ?? e.club?.name,
      date,
      time,
      location: e.location ?? e.place ?? "-",
      status,
    };
  };

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
    getCurrentUser()
      .then((user) => setIsSchoolAdmin(user.role_global === "school_admin"))
      .catch(() => setIsSchoolAdmin(false));
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

  const handleLike = async (postId) => {
    const post = feedPosts.find((p) => p.id === postId);
    if (!post) return;
    try {
      const { likes_count } = post.isLiked
        ? await unlikePost(postId)
        : await likePost(postId);
      setFeedPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isLiked: !post.isLiked, likes: likes_count } : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      navigator.share({ url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard");
      });
    }
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
        {isSchoolAdmin && (
          <div className="mb-6 flex gap-4">
            <Button
              onClick={() => navigate("/admin/clubs")}
              className="bg-blue-600 text-white"
            >
              Manage Clubs
            </Button>
            <Button
              onClick={() => navigate("/admin/categories")}
              className="bg-blue-600 text-white"
            >
              Manage Categories
            </Button>
          </div>
        )}
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
              {/* Fix semua bug yang ada. Buat like nya bekerja, habus komentarnya. */}
              {loadingPosts ? (
                <p>Loading...</p>
              ) : errPosts ? (
                <p className="text-red-500">{errPosts}</p>
              ) : !feedPosts.length ? (
                <EmptyState message="No posts available" />
              ) : (
                feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => handleLike(post.id)}
                    onComment={() => navigate(`/posts/${post.id}`)}
                    onShare={() => handleShare(post.id)}
                  />
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
