import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import AdminDashboard from "./pages/AdminDashboard";
import AdminB2B from "./pages/AdminB2B";
import AdminB2C from "./pages/AdminB2C";
import AdminSettings from "./pages/AdminSettings";
import Account from "./pages/Account";
import EventRecap from "./pages/EventRecap";
import PublicEvents from "./pages/PublicEvents";
import AnalyticsEvents from "./pages/AnalyticsEvents";
import AnalyticsPhotos from "./pages/AnalyticsPhotos";
import FeaturesCapture from "./pages/FeaturesCapture";
import FeaturesSharing from "./pages/FeaturesSharing";
import FeaturesPrivacy from "./pages/FeaturesPrivacy";
import FeaturesRoles from "./pages/FeaturesRoles";
import FeaturesFeed from "./pages/FeaturesFeed";
import FeaturesPlatforms from "./pages/FeaturesPlatforms";
import StatusPage from "./pages/StatusPage";
import SecurityPage from "./pages/SecurityPage";
import SupportPage from "./pages/SupportPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/b2b" element={<AdminB2B />} />
          <Route path="/admin/b2c" element={<AdminB2C />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/recap/:eventId" element={<EventRecap />} />
          <Route path="/analytics/events" element={<AnalyticsEvents />} />
          <Route path="/analytics/photos" element={<AnalyticsPhotos />} />
          <Route path="/features/capture" element={<FeaturesCapture />} />
          <Route path="/features/sharing" element={<FeaturesSharing />} />
          <Route path="/features/privacy" element={<FeaturesPrivacy />} />
          <Route path="/features/roles" element={<FeaturesRoles />} />
          <Route path="/features/feed" element={<FeaturesFeed />} />
          <Route path="/features/platforms" element={<FeaturesPlatforms />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
