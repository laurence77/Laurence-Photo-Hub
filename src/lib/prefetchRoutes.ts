// Map of route paths to dynamic importers for prefetching lazy chunks
export const routeImporters: Record<string, () => Promise<unknown>> = {
  '/events': () => import('@/pages/PublicEvents'),
  '/features/capture': () => import('@/pages/FeaturesCapture'),
  '/features/sharing': () => import('@/pages/FeaturesSharing'),
  '/features/privacy': () => import('@/pages/FeaturesPrivacy'),
  '/features/roles': () => import('@/pages/FeaturesRoles'),
  '/features/feed': () => import('@/pages/FeaturesFeed'),
  '/features/platforms': () => import('@/pages/FeaturesPlatforms'),
  '/analytics/events': () => import('@/pages/AnalyticsEvents'),
  '/analytics/photos': () => import('@/pages/AnalyticsPhotos'),
  '/status': () => import('@/pages/StatusPage'),
  '/security': () => import('@/pages/SecurityPage'),
  '/support': () => import('@/pages/SupportPage'),
  '/legal/terms': () => import('@/pages/TermsPage'),
  '/legal/privacy': () => import('@/pages/PrivacyPage'),
  '/account': () => import('@/pages/Account'),
};

export function prefetchRoute(path: string) {
  const imp = routeImporters[path];
  if (imp) imp().catch(() => void 0);
}
