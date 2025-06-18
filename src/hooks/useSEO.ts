import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEOService, { SEOConfig } from '../services/seoService';

/**
 * Custom hook for managing SEO on page changes
 */
export function useSEO(customConfig?: Partial<SEOConfig>) {
  const location = useLocation();
  const seoService = SEOService;

  useEffect(() => {
    // Get the page name from the current path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageName = pathSegments[0] || 'home';

    // Get default SEO config for the page
    const defaultConfig = seoService.getPageSEO(pageName);

    // Merge with custom config if provided
    const finalConfig = customConfig 
      ? { ...defaultConfig, ...customConfig }
      : defaultConfig;

    // Update SEO
    seoService.updatePageSEO(finalConfig);

    // Scroll to top on page change for better UX
    window.scrollTo(0, 0);
  }, [location.pathname, customConfig]);
}

/**
 * Hook for dynamic SEO updates (useful for content pages)
 */
export function useDynamicSEO(config: SEOConfig) {
  const seoService = SEOService;

  useEffect(() => {
    seoService.updatePageSEO(config);
  }, [config]);
}

export default useSEO;
