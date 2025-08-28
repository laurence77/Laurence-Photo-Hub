import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import Index from "./pages/Index";
import Enhanced3DLoading from "./components/Enhanced3DLoading";
import { ThreeDProvider } from "./context/3DContext";
const AdminPortal = lazy(() => import('./pages/AdminPortal'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminB2B = lazy(() => import('./pages/AdminB2B'));
const AdminB2C = lazy(() => import('./pages/AdminB2C'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const SuperAdmin = lazy(() => import('./pages/SuperAdmin'));
const Account = lazy(() => import('./pages/Account'));
const EventRecap = lazy(() => import('./pages/EventRecap'));
const PublicEvents = lazy(() => import('./pages/PublicEvents'));
const AnalyticsEvents = lazy(() => import('./pages/AnalyticsEvents'));
const AnalyticsPhotos = lazy(() => import('./pages/AnalyticsPhotos'));
const FeaturesCapture = lazy(() => import('./pages/FeaturesCapture'));
const FeaturesSharing = lazy(() => import('./pages/FeaturesSharing'));
const FeaturesPrivacy = lazy(() => import('./pages/FeaturesPrivacy'));
const FeaturesRoles = lazy(() => import('./pages/FeaturesRoles'));
const FeaturesFeed = lazy(() => import('./pages/FeaturesFeed'));
const FeaturesPlatforms = lazy(() => import('./pages/FeaturesPlatforms'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThreeDProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AuthProvider>
            <Suspense fallback={<Enhanced3DLoading variant="spinner" message="Loading experience…" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/b2b" element={<RequireAuth><AdminB2B /></RequireAuth>} />
            <Route path="/admin/b2c" element={<RequireAuth><AdminB2C /></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
            <Route path="/superadmin" element={<RequireAuth><SuperAdmin /></RequireAuth>} />
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
          </Suspense>
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </ThreeDProvider>
  </QueryClientProvider>
);

export default App;
