import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "@pages/Auth/LoginPage";
import RegisterPage from "@pages/Auth/RegisterPage";
import ClubListPage from "@pages/Clubs/ClubListPage";
import ClubProfilePage from "@pages/Clubs/ClubProfilePage";
import CreateEventPage from "@pages/Clubs/CreateEventPage";
import StudentDashboard from "@pages/Dashboard/StudentDashboard";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/clubs", element: <RequireAuth><ClubListPage /></RequireAuth> },
  { path: "/clubs/:id", element: <RequireAuth><ClubProfilePage /></RequireAuth> },
  { path: "/clubs/:id/events/new", element: <RequireAuth><CreateEventPage /></RequireAuth> },
  { path: "/dashboard", element: <RequireAuth><StudentDashboard /></RequireAuth> },
]);
