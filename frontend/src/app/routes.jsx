import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import RequireAuth from './RequireAuth';

const LoginPage = lazy(() => import('@pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/Auth/RegisterPage'));
const ClubListPage = lazy(() => import('@pages/Clubs/ClubListPage'));
const ClubProfilePage = lazy(() => import('@pages/Clubs/ClubProfilePage'));
const CreateEventPage = lazy(() => import('@pages/Clubs/CreateEventPage'));
const StudentDashboard = lazy(() => import('@pages/Dashboard/StudentDashboard'));
const AnnouncementsList = lazy(() => import('@pages/Announcements/List'));
const AnnouncementDetail = lazy(() => import('@pages/Announcements/Detail'));
const AnnouncementForm = lazy(() => import('@pages/Announcements/Form'));
const EventsList = lazy(() => import('@pages/Events/List'));
const EventDetail = lazy(() => import('@pages/Events/Detail'));
const PostDetail = lazy(() => import('@pages/Posts/Detail'));
const SearchResults = lazy(() => import('@pages/Search/ResultsPage'));
const NotFound = lazy(() => import('@pages/NotFound'));

const withSuspense = (element) => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<RequireAuth><StudentDashboard /></RequireAuth>) },
      { path: 'dashboard', element: withSuspense(<RequireAuth><StudentDashboard /></RequireAuth>) },
      { path: 'clubs', element: withSuspense(<RequireAuth><ClubListPage /></RequireAuth>) },
      { path: 'clubs/:id', element: withSuspense(<RequireAuth><ClubProfilePage /></RequireAuth>) },
      { path: 'clubs/:id/events/new', element: withSuspense(<RequireAuth><CreateEventPage /></RequireAuth>) },
      { path: 'events', element: withSuspense(<RequireAuth><EventsList /></RequireAuth>) },
      { path: 'events/:id', element: withSuspense(<RequireAuth><EventDetail /></RequireAuth>) },
      { path: 'posts/:id', element: withSuspense(<RequireAuth><PostDetail /></RequireAuth>) },
      { path: 'announcements', element: withSuspense(<RequireAuth><AnnouncementsList /></RequireAuth>) },
      { path: 'announcements/new', element: withSuspense(<RequireAuth><AnnouncementForm /></RequireAuth>) },
      { path: 'announcements/:id', element: withSuspense(<RequireAuth><AnnouncementDetail /></RequireAuth>) },
      { path: 'announcements/:id/edit', element: withSuspense(<RequireAuth><AnnouncementForm /></RequireAuth>) },
      { path: 'search', element: withSuspense(<RequireAuth><SearchResults /></RequireAuth>) },
    ],
  },
  { path: '/login', element: withSuspense(<LoginPage />) },
  { path: '/register', element: withSuspense(<RegisterPage />) },
  { path: '*', element: withSuspense(<NotFound />) },
]);
