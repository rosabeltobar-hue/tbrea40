import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DailyCheckin from "./pages/DailyCheckin";
import EmoCalendar from "./pages/EmoCalendar";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./pages/Profile";
import NutritionLibrary from "./pages/NutritionLibrary";
import MetaboliteEstimator from "./pages/MetaboliteEstimator";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notifications from "./pages/Notifications";
import Donations from "./pages/Donations";
import { useUser } from "./context/UserContext";
import { useNotifications } from "./hooks/useNotifications";
import { OfflineProvider } from "./context/OfflineContext";
import { OfflineBanner } from "./components/OfflineBanner";

export default function App() {
  const { user } = useUser();

  // Initialize notifications for authenticated user
  useNotifications(user?.uid);

  function RequireAuth({ children }: { children: any }) {
    const { pathname, search } = window.location;
    // Use react-router's Navigate with state to preserve intended location.
    // We prefer using location from react-router, but keep this simple and
    // rely on `Navigate` with `state` when redirecting below.
    if (!user)
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: { pathname, search } }}
        />
      );
    return children;
  }

  return (
    <OfflineProvider>
      <OfflineBanner />
      <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/tbrea40' : '/'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checkin" element={<DailyCheckin />} />
          <Route path="/calendar" element={<EmoCalendar />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/nutrition" element={<NutritionLibrary />} />
          <Route path="/estimator" element={<MetaboliteEstimator />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route path="/donations" element={<Donations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </OfflineProvider>
  );
}
