import { Search, Gamepad2, Palette, FlaskConical, Languages, Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "./components/Header";
import { ClubCard } from "./components/ClubCard";
import { EventCard } from "./components/EventCard";
import { BottomNavigation } from "./components/BottomNavigation";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { CreateEventPage } from "./components/CreateEventPage";
import { ClubProfilePage } from "./components/ClubProfilePage";
import { StudentDashboard } from "./components/StudentDashboard";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState("");

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("login");
  };

  const handleRegister = () => {
    setCurrentPage("register");
  };

  const handleBackToLogin = () => {
    setCurrentPage("login");
  };

  const handleCreateEvent = () => {
    setCurrentPage("create-event");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleSaveEvent = (eventData) => {
    // Handle saving event data here
    console.log("Saving event:", eventData);
    setCurrentPage("dashboard");
  };

  const handleViewClubProfile = (clubId) => {
    setSelectedClubId(clubId);
    setCurrentPage("club-profile");
  };

  // Show login page
  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Show register page
  if (currentPage === "register") {
    return <RegisterPage onLogin={handleLogin} onBack={handleBackToLogin} />;
  }

  // Show create event page
  if (currentPage === "create-event") {
    return <CreateEventPage onBack={handleBackToDashboard} onSave={handleSaveEvent} />;
  }

  // Show club profile page
  if (currentPage === "club-profile") {
    return <ClubProfilePage onBack={handleBackToDashboard} clubId={selectedClubId} />;
  }

  // Show student dashboard when logged in
  if (currentPage === "dashboard" && isLoggedIn) {
    return (
      <StudentDashboard 
        onViewClubProfile={handleViewClubProfile}
        onCreateEvent={handleCreateEvent}
        studentName={user?.name || "User"}
      />
    );
  }

  // Mock data for clubs
  const featuredClubs = [
    {
      id: "1",
      name: "Basketball Club",
      image: "https://images.unsplash.com/photo-1720716430227-82ce7abf761d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMHNjaG9vbHxlbnwxfHx8fDE3NTU5Mjc5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      memberCount: 24,
      category: "Olahraga",
      description: "Join our dynamic basketball team and improve your skills while having fun with fellow athletes.",
      location: "Sports Hall"
    },
    {
      id: "2", 
      name: "Drama Club",
      image: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGNsdWIlMjB0aGVhdGVyfGVufDF8fHx8MTc1NTkyNzkwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      memberCount: 18,
      category: "Seni",
      description: "Express yourself through acting, theater, and performance arts in our creative drama club.",
      location: "Theater Room"
    },
    {
      id: "3",
      name: "Science Lab",
      image: "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU1OTI3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      memberCount: 15,
      category: "Sains",
      description: "Explore the wonders of science through hands-on experiments and research projects.",
      location: "Science Lab"
    },
    {
      id: "4",
      name: "Debate Society",
      image: "https://images.unsplash.com/photo-1607586501844-9a7f11af251c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHNjaG9vbCUyMGFjdGl2aXRpZXN8ZW58MXx8fHwxNzU1OTI3OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      memberCount: 12,
      category: "Bahasa", 
      description: "Develop your public speaking and critical thinking skills through competitive debates.",
      location: "Conference Room"
    }
  ];

  // Mock data for events
  const upcomingEvents = [
    {
      id: "1",
      title: "Basketball Tournament",
      clubName: "Basketball Club",
      date: "25 Aug 2025",
      time: "15:00 - 17:00",
      location: "Sports Hall",
      image: "https://images.unsplash.com/photo-1720716430227-82ce7abf761d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwdGVhbSUyMHNjaG9vbHxlbnwxfHx8fDE3NTU5Mjc5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      attendeeCount: 45
    },
    {
      id: "2",
      title: "Drama Performance",
      clubName: "Drama Club", 
      date: "27 Aug 2025",
      time: "19:00 - 21:00",
      location: "School Auditorium",
      image: "https://images.unsplash.com/photo-1572700432881-42c60fe8c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGNsdWIlMjB0aGVhdGVyfGVufDF8fHx8MTc1NTkyNzkwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      attendeeCount: 32
    },
    {
      id: "3",
      title: "Science Fair",
      clubName: "Science Lab",
      date: "30 Aug 2025", 
      time: "10:00 - 16:00",
      location: "Main Hall",
      image: "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFiJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzU1OTI3OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      attendeeCount: 28
    }
  ];

  const filterCategories = [
    { icon: <Gamepad2 className="size-4" />, label: "Olahraga", count: 8 },
    { icon: <Palette className="size-4" />, label: "Seni", count: 6 },
    { icon: <FlaskConical className="size-4" />, label: "Sains", count: 4 },
    { icon: <Languages className="size-4" />, label: "Bahasa", count: 3 }
  ];

  // Dashboard page (main content)
  return (
    <div className="min-h-screen bg-background">
      <Header showProfile={isLoggedIn} onLogout={handleLogout} />
      
      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Temukan Ekstrakurikuler Impianmu
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Bergabunglah dengan komunitas sekolah dan kembangkan bakatmu bersama teman-teman
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground size-5" />
                  <Input 
                    placeholder="Cari ekstrakurikuler, event, atau kegiatan..." 
                    className="pl-12 pr-4 py-4 text-lg bg-white text-foreground border-0 rounded-xl"
                  />
                  <Button className="absolute right-2 top-2 bg-[#2563EB] hover:bg-blue-700 rounded-lg">
                    Cari
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="py-6 bg-background sticky top-16 z-40 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 md:justify-center">
              {filterCategories.map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 whitespace-nowrap cursor-pointer hover:bg-[#2563EB] hover:text-white transition-colors"
                >
                  {category.icon}
                  <span>{category.label}</span>
                  <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                    {category.count}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Clubs Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Ekskul Populer</h2>
              <Button variant="ghost" className="text-[#2563EB] hover:text-blue-700">
                Lihat Semua
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredClubs.map((club) => (
                <ClubCard key={club.id} {...club} onViewProfile={handleViewClubProfile} />
              ))}
            </div>
          </div>
        </section>

        {/* Events This Week Section */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Event Minggu Ini</h2>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleCreateEvent}
                  className="bg-[#16A34A] hover:bg-green-700 text-white"
                >
                  <Plus className="size-4 mr-2" />
                  Create Event
                </Button>
                <Button variant="ghost" className="text-[#2563EB] hover:text-blue-700">
                  Lihat Semua
                </Button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0 w-80 md:w-auto">
                  <EventCard {...event} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Belum Menemukan yang Cocok?
            </h2>
            <p className="text-lg mb-6 text-orange-100">
              Jelajahi semua ekstrakurikuler yang tersedia di sekolah
            </p>
            <Button className="bg-white text-[#F97316] hover:bg-gray-100 px-8 py-3 text-lg">
              Jelajahi Semua Ekskul
            </Button>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}