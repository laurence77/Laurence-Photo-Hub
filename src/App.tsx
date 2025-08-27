import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
