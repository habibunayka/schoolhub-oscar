// src/pages/ClubProfilePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClub, joinClub, leaveClub, listMembers, listJoinRequests, setMemberStatus } from "@services/clubs.js";
import { listPosts } from "@services/posts.js";
import { listEvents } from "@services/events.js";
import { me as getCurrentUser } from "@services/auth.js";
import { getAssetUrl } from "@utils";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  Users,
  Calendar,
  MapPin,
  Settings,
  UserPlus,
  Plus,
} from "lucide-react";
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
import useConfirm from "@hooks/useConfirm.jsx";

import SafeImage from "@components/SafeImage";
import { getInitials } from "@utils/string";
import { toast } from "sonner";

export default function ClubProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [clubData, setClubData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [canViewRequests, setCanViewRequests] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { confirm, ConfirmDialog } = useConfirm();

  const normalizePost = (p) => ({
    id: String(p.id),
    author: p.author_name ?? p.author?.name,
    authorAvatar: getAssetUrl(p.author_avatar ?? p.author?.avatar_url ?? null),
    timestamp: p.created_at,
    caption: p.body_html ? p.body_html.replace(/<[^>]*>/g, "") : "",
    images: Array.isArray(p.images)
      ? p.images.map((img) => getAssetUrl(img))
      : p.image_url
        ? [getAssetUrl(p.image_url)]
        : [],
    likes: p.likes_count ?? 0,
    comments: p.comments_count ?? 0,
    isLiked: !!p.liked,
  });

  useEffect(() => {
    async function fetchClub() {
      const data = await getClub(id);
      setClubData({
        id: data.id,
        name: data.name,
        description: data.description || "",
        category: data.category || "",
        memberCount: data.member_count || 0,
        founded: data.founded || "",
        location: data.location || "",
        coverImage: getAssetUrl(data.banner_url) || "",
        logoImage: getAssetUrl(data.logo_url) || "",
        isJoined: data.membership_status === "approved",
        isRequested: data.membership_status === "pending",
        stats: { events: 0, posts: 0, achievements: 0 },
      });
    }
    fetchClub();
  }, [id]);

  useEffect(() => {
    async function fetchExtras() {
      const [postsData, membersData, eventsData] = await Promise.all([
        listPosts(id),
        listMembers(id),
        listEvents(id),
      ]);
      let requestsData = [];
      try {
        requestsData = await listJoinRequests(id);
        setCanViewRequests(true);
      } catch {
        setCanViewRequests(false);
      }
      setPosts((postsData || []).map(normalizePost));
      setMembers(
        (membersData || []).map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          avatar: getAssetUrl(m.avatar_url) || "",
        }))
      );
      setRequests(
        (requestsData || []).map((r) => ({
          id: r.id,
          name: r.name,
          avatar: getAssetUrl(r.avatar_url) || "",
        }))
      );
      setUpcomingEvents(eventsData || []);
      setClubData((prev) =>
        prev
          ? {
              ...prev,
              memberCount: (membersData || []).length,
              stats: {
                ...prev.stats,
                events: (eventsData || []).length,
                posts: (postsData || []).length,
              },
            }
          : prev
      );
    }
    fetchExtras();
  }, [id]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        const role =
          user.role_global === 'school_admin'
            ? 'school_admin'
            : user.club_id
              ? 'club_admin'
              : 'student';
        setCurrentUser({ id: user.id, role, clubId: user.club_id });
      } catch (e) {
        console.error(e);
      }
    }
    fetchCurrentUser();
  }, []);

  if (!clubData) return null;

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.likes + (p.isLiked ? -1 : 1),
            }
          : p
      )
    );
  };

  const handleJoinClub = async () => {
    if (clubData.isJoined || clubData.isRequested) return;
    if (!(await confirm(`Request to join ${clubData.name}?`))) return;
    try {
      const res = await joinClub(clubData.id);
      if (res.status === 'approved') {
        setClubData({ ...clubData, isJoined: true, isRequested: false });
        toast.success('Joined club');
      } else {
        setClubData({ ...clubData, isRequested: true });
        toast.success('Join request sent');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to send request');
    }
  };

  const handleLeaveClub = async () => {
    if (!clubData.isJoined) return;
    if (!(await confirm(`Leave ${clubData.name}?`))) return;
    try {
      await leaveClub(clubData.id);
      setClubData({ ...clubData, isJoined: false, isRequested: false });
      toast.success('Left club');
    } catch (e) {
      console.error(e);
      toast.error('Failed to leave club');
    }
  };

  const handleRequestDecision = async (userId, decision) => {
    try {
      await setMemberStatus(id, userId, { decision });
      setRequests(prev => prev.filter(r => r.id !== userId));
      if (decision === 'approved') {
        const req = requests.find(r => r.id === userId);
        if (req) {
          setMembers(prev => [...prev, { ...req, role: 'member' }]);
          setClubData(prev => ({ ...prev, memberCount: prev.memberCount + 1 }));
        }
        toast.success('Member approved');
      } else {
        toast.success('Request rejected');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update request');
    }
  };

  const handleCreateEvent = () => {
    navigate(`/clubs/${id}/events/new`);
  };

  const handleCreatePost = () => {
    navigate(`/clubs/${id}/posts/new`);
  };

  const isClubAdmin =
    currentUser &&
    currentUser.role === 'club_admin' &&
    String(currentUser.clubId) === id;

  return (
    <>
    <ConfirmDialog />
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-bold text-xl">{clubData.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {clubData.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="size-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Share className="size-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Photo Section */}
      <section className="relative">
        <div className="h-[300px] relative">
          {/* SafeImage fills the area and provides placeholder + fallback */}
          <SafeImage
            src={clubData.coverImage}
            alt={`${clubData.name} cover`}
            wrapperClassName="absolute inset-0 w-full h-full"
            className="w-full h-full object-cover"
            sizePx={1200}
            placeholderSize={64}
            rounded={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Club Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end gap-6">
              {/* Club Logo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white">
                  <SafeImage
                    src={clubData.logoImage}
                    alt={`${clubData.name} logo`}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover"
                    sizePx={128}
                    placeholderSize={40}
                    rounded={true}
                  />
                </div>
              </div>

              {/* Club Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{clubData.name}</h1>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {clubData.category}
                  </Badge>
                </div>
                <p className="text-lg text-white/90 mb-4 max-w-2xl">
                  {clubData.description}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="size-4" />
                    <span>{clubData.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>Founded {clubData.founded}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    <span>{clubData.location}</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <div>
                <Button
                  onClick={clubData.isJoined ? handleLeaveClub : handleJoinClub}
                  disabled={clubData.isRequested && !clubData.isJoined}
                  className={`${clubData.isJoined ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2563EB] hover:bg-blue-700'} text-white px-8 disabled:bg-gray-300 disabled:text-gray-600`}
                  size="lg"
                >
                  <UserPlus className="size-4 mr-2" />
                  {clubData.isJoined
                    ? "Leave Club"
                    : clubData.isRequested
                      ? "Requested"
                      : "Join Club"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-14 bg-transparent border-0 gap-8">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent rounded-none pb-4"
              >
                Posts ({clubData.stats.posts})
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent rounded-none pb-4"
              >
                Events ({clubData.stats.events})
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent rounded-none pb-4"
              >
                Members ({clubData.memberCount})
              </TabsTrigger>
              {canViewRequests && (
                <TabsTrigger
                  value="requests"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent rounded-none pb-4"
                >
                  Requests ({requests.length})
                </TabsTrigger>
              )}
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] data-[state=active]:bg-transparent rounded-none pb-4"
              >
                About
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Main Content - 70% */}
          <div className="lg:col-span-7">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="posts" className="mt-0">
                <div className="space-y-6">
                  {isClubAdmin && (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreatePost}
                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white"
                      >
                        <Plus className="size-4" />
                        Create Post
                      </Button>
                    </div>
                  )}
                  {posts.map((post) => (
                    // Buat ini benar-benar posts yang real, ada beberapa bug disini seperti caption nya gaada. Dan buat like nya bekerja, habus komentarnya.
                    <Card key={post.id} className="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <SafeImage
                              src={post.authorAvatar}
                              alt={post.author}
                              wrapperClassName="w-full h-full rounded-full"
                              className="w-full h-full object-cover"
                              sizePx={64}
                              placeholderSize={28}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{post.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {post.timestamp}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <div className="px-6 pb-3">
                        <p className="text-sm leading-relaxed">{post.caption}</p>
                      </div>

                      {post.images && post.images.length > 0 && (
                        post.images.length === 1 ? (
                          <div className="w-full">
                            <SafeImage
                              src={post.images[0]}
                              alt="Post content"
                              wrapperClassName="w-full h-80"
                              className="w-full h-full object-cover"
                              sizePx={800}
                              placeholderSize={48}
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
                                    wrapperClassName="w-full h-80"
                                    className="w-full h-full object-cover"
                                    sizePx={800}
                                    placeholderSize={48}
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
                              className="flex items-center gap-2 p-2"
                            >
                              <Heart
                                className={`size-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                              />
                              <span className="text-sm">{post.likes}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-2 p-2"
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
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="space-y-4">
                  {isClubAdmin && (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreateEvent}
                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white"
                      >
                        <Plus className="size-4" />
                        Create Event
                      </Button>
                    </div>
                  )}
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium mb-2">{event.title}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <Button>RSVP</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <Card key={member.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <SafeImage
                              src={member.avatar}
                              alt={member.name}
                              wrapperClassName="w-full h-full rounded-full"
                              className="w-full h-full object-cover"
                              sizePx={96}
                              placeholderSize={36}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {canViewRequests && (
                <TabsContent value="requests" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {requests.map((req) => (
                      <Card key={req.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden">
                                <SafeImage
                                  src={req.avatar}
                                  alt={req.name}
                                  wrapperClassName="w-full h-full rounded-full"
                                  className="w-full h-full object-cover"
                                  sizePx={96}
                                  placeholderSize={36}
                                />
                              </div>
                              <p className="font-medium">{req.name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleRequestDecision(req.id, 'approved')}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRequestDecision(req.id, 'rejected')}>
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="about" className="mt-0">
                <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">About {clubData.name}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {clubData.description}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-3">Club Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Founded:</span>{" "}
                              {clubData.founded}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Category:</span>{" "}
                              {clubData.category}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Location:</span>{" "}
                              {clubData.location}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Members:</span>{" "}
                              {clubData.memberCount}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Events:</span>{" "}
                              {clubData.stats.events}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Achievements:</span>{" "}
                              {clubData.stats.achievements}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 30% */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#2563EB]">
                      {clubData.memberCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#16A34A]">
                      {clubData.stats.events}
                    </p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">
                      {clubData.stats.achievements}
                    </p>
                    <p className="text-xs text-muted-foreground">Awards</p>
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
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <Calendar className="size-4 text-[#2563EB] mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Member Grid */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {members.slice(0, 6).map((member) => (
                    <div key={member.id} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full overflow-hidden">
                        <SafeImage
                          src={member.avatar}
                          alt={member.name}
                          wrapperClassName="w-full h-full rounded-full"
                          className="w-full h-full object-cover"
                          sizePx={96}
                          placeholderSize={36}
                        />
                      </div>
                      <p className="text-xs font-medium truncate">
                        {(member.name ?? "").split(" ")[0] || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  ))}
                </div>
                {clubData.memberCount > 6 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">
                      +{clubData.memberCount - 6} more members
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
