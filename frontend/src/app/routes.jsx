import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "@pages/Auth/LoginPage";
import RegisterPage from "@pages/Auth/RegisterPage";
import ClubListPage from "@pages/Clubs/ClubListPage";
import ClubProfilePage from "@pages/Clubs/ClubProfilePage";
import CreateEventPage from "@pages/Clubs/CreateEventPage";
import StudentDashboard from "@pages/Dashboard/StudentDashboard";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/clubs", element: <ClubListPage /> },
  { path: "/clubs/:id", element: <ClubProfilePage /> },
  { path: "/clubs/:id/events/new", element: <CreateEventPage /> },
  { path: "/dashboard", element: <StudentDashboard /> },
]);
