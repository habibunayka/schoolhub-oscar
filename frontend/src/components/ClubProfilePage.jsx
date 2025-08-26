import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Share, Users, Calendar, MapPin, Settings, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export function ClubProfilePage({ onBack, clubId }) {
  const [activeTab, setActiveTab] = useState("posts");

  // Mock club data - in real app this would be fetched based on clubId
  const clubData = {
    id: "1",
    name: "Basketball Club",
    description: "Join our dynamic basketball team and improve your skills while having fun with fellow athletes. We welcome players of all skill levels and focus on teamwork, discipline, and fun.",
    category: "Olahraga",
    memberCount: 24,
    founded: "2020",
    location: "Sports Hall",
    coverImage: "https://images.unsplash.com/photo-1659468551117-8255d708e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMGdyb3VwfGVufDF8fHx8MTc1NTkyODcyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    logoImage: "https://images.unsplash.com/photo-1720716430227-82ce7abf761d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMHNjaG9vbHxlbnwxfHx8fDE3NTU5Mjc5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isJoined: false,
    stats: {
      events: 12,
      posts: 48,
      achievements: 8
    }
  };

  const posts = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1703114608920-682133cc2ea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwcHJhY3RpY2V8ZW58MXx8fHwxNzU1OTI4NzI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Great practice session today! Our new members are really stepping up their game. 🏀💪 #BasketballLife #Teamwork",
      author: "Alex Rodriguez",
      authorAvatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "2 hours ago",
      likes: 18,
      comments: 5,
      isLiked: false
    },
    {
      id: "2", 
      image: "https://images.unsplash.com/photo-1515326283062-ef852efa28a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzU1ODMwMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Home court advantage! Looking forward to tomorrow's tournament. Come support us! 🏆",
      author: "Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b68b7490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "1 day ago",
      likes: 32,
      comments: 12,
      isLiked: true
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1659468551117-8255d708e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMGdyb3VwfGVufDF8fHx8MTc1NTkyODcyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Team bonding session complete! Nothing builds chemistry like some friendly competition. See you all at practice!",
      author: "Mike Johnson", 
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      timestamp: "3 days ago",
      likes: 24,
      comments: 8,
      isLiked: false
    }
  ];

  const members = [
    { id: "1", name: "Alex Rodriguez", avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU3fDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Captain" },
    { id: "2", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b68b7490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU4fDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Co-Captain" },
    { id: "3", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzU5fDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Member" },
    { id: "4", name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzYwfDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Member" },
    { id: "5", name: "David Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzYxfDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Member" },
    { id: "6", name: "Lisa Wang", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODgyMzYyfDA&ixlib=rb-4.1.0&q=80&w=1080", role: "Member" }
  ];

  const upcomingEvents = [
    {
      id: "1",
      title: "Basketball Tournament",
      date: "25 Aug 2025",
      time: "15:00 - 17:00",
      location: "Sports Hall"
    },
    {
      id: "2", 
      title: "Team Training Session",
      date: "28 Aug 2025",
      time: "16:00 - 18:00",
      location: "Outdoor Court"
    },
    {
      id: "3",
      title: "Inter-School Match",
      date: "2 Sep 2025", 
      time: "14:00 - 16:00",
      location: "Main Stadium"
    }
  ];

  const handleLike = (postId) => {
    // Handle like functionality
    console.log("Liked post:", postId);
  };

  const handleJoinClub = () => {
    // Handle join club functionality
    console.log("Joining club:", clubData.id);
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
                <h1 className="font-bold text-xl">{clubData.name}</h1>
                <p className="text-sm text-muted-foreground">{clubData.category}</p>
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
        <div 
          className="h-[300px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${clubData.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        
        {/* Club Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end gap-6">
              {/* Club Logo */}
              <div className="relative">
                <img
                  src={clubData.logoImage}
                  alt={`${clubData.name} logo`}
                  className="w-24 h-24 rounded-xl border-4 border-white object-cover"
                />
              </div>
              
              {/* Club Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{clubData.name}</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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
                  onClick={handleJoinClub}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white px-8"
                  size="lg"
                >
                  <UserPlus className="size-4 mr-2" />
                  {clubData.isJoined ? "Joined" : "Join Club"}
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
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.authorAvatar} alt={post.author} />
                            <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author}</p>
                            <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <div className="px-6 pb-3">
                        <p className="text-sm leading-relaxed">{post.caption}</p>
                      </div>
                      
                      <div className="w-full">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-80 object-cover"
                        />
                      </div>
                      
                      <CardContent className="pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="flex items-center gap-2 p-2"
                            >
                              <Heart className={`size-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              <span className="text-sm">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
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
                  {upcomingEvents.map((event) => (
                    <Card key={event.id}>
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
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
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
              
              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3">About {clubData.name}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {clubData.description} We meet every Tuesday and Thursday from 4:00 PM to 6:00 PM at the Sports Hall. 
                          Our club focuses on developing basketball skills, teamwork, and sportsmanship. We participate in 
                          inter-school tournaments and organize friendly matches throughout the year.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-3">Club Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Founded:</span> {clubData.founded}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Category:</span> {clubData.category}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Location:</span> {clubData.location}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Members:</span> {clubData.memberCount}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Events:</span> {clubData.stats.events}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Achievements:</span> {clubData.stats.achievements}
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#2563EB]">{clubData.memberCount}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#16A34A]">{clubData.stats.events}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#F97316]">{clubData.stats.achievements}</p>
                    <p className="text-xs text-muted-foreground">Awards</p>
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
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
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
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {members.slice(0, 6).map((member) => (
                    <div key={member.id} className="text-center">
                      <Avatar className="w-12 h-12 mx-auto mb-1">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium truncate">{member.name.split(' ')[0]}</p>
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
  );
}