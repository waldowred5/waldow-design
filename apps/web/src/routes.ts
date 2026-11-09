/**
 * The two layouts, each its own chunk: the full-width landing page at `/`, and the docs
 * (sidebar, outline and every guide page) everywhere else. The entry chunk holds only the
 * router and the mode store, so whichever layout someone lands on, they don't download the
 * other until they head there (the landing page prefetches the docs once it's idle).
 */
export const loadLanding = () => import('./landing/landing-page')
export const loadDocs = () => import('./docs/docs-app')
