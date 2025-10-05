import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Index from "./pages/Index";
import OfferDetails from "./pages/OfferDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Login from "./pages/Login";
import MyVolunteering from "./pages/MyVolunteering";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import NewEvent from "./pages/organizer/NewEvent";
import EventDetails from "./pages/organizer/EventDetails";
import Chats from "./pages/Chats";
import ChatRoom from "./pages/ChatRoom";
import Feed from "./pages/Feed";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oferta/:id" element={<OfferDetails />} />
            <Route path="/oferta/:id/zglos" element={
              <AuthGuard>
                <ApplicationForm />
              </AuthGuard>
            } />
            <Route path="/moj-wolontariat" element={
              <AuthGuard>
                <MyVolunteering />
              </AuthGuard>
            } />
            <Route path="/profil/:volunteerId" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            <Route path="/feed" element={<Feed />} />
            <Route path="/czaty" element={<Chats />} />
            <Route path="/czaty/:id" element={<ChatRoom />} />
            <Route path="/organizator" element={<OrganizerDashboard />} />
            <Route path="/organizator/nowe-wydarzenie" element={<NewEvent />} />
            <Route path="/organizator/wydarzenie/:id" element={<EventDetails />} />
            <Route path="/koordynator" element={
              <AuthGuard>
                <CoordinatorDashboard />
              </AuthGuard>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
