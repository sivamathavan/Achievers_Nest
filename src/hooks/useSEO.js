import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title and meta description for SEO.
 * @param {string} title - The title of the page
 * @param {string} [description] - Optional meta description of the page
 */
export const useSEO = (title, description) => {
  useEffect(() => {
    // Save previous title
    const prevTitle = document.title;
    
    // Set new title
    if (title) {
      document.title = `${title} | Achievers Nest`;
    }

    // Set new description if provided
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    if (description && metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Cleanup to restore previous title/description on unmount
    return () => {
      document.title = prevTitle;
      if (prevDesc && metaDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, [title, description]);
};
export default useSEO;
