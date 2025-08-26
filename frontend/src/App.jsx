import { Search, Gamepad2, Palette, FlaskConical, Languages, Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "./components/header";
import { ClubCard } from "./components/ClubCard";
import { EventCard } from "./components/EventCard";
import { BottomNavigation } from "./components/BottomNavigation";
import { LoginPage } from "./components/Loginpage";
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
  const [selectedClubId, setSelectedClubId] = useState("");

  const handleLogin = () => {
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
        studentName="Alex"
      />
    );
  }
}