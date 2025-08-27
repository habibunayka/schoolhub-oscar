import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@components/Navbar';
import { BottomNavigation } from '@components/common/ui';

const titles = {
  '/': 'Dashboard',
  '/login': 'Login',
  '/register': 'Register',
  '/dashboard': 'Dashboard',
  '/clubs': 'Clubs',
  '/events': 'Events',
  '/announcements': 'Announcements',
};

export default function AppLayout() {
  const location = useLocation();
  useEffect(() => {
    document.title = titles[location.pathname] || 'SchoolHub';
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-20 md:pb-8">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
