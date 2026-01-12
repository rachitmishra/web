import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description?: string;
  ogType?: string;
  image?: string;
}

export const useSEO = ({ title, description, ogType, image }: SEOProps) => {
  useEffect(() => {
    const siteName = 'Hopolo';
    const fullTitle = `${title} | ${siteName}`;
    
    // Update Title
    document.title = fullTitle;

    // Update or Create Meta Tags
    const updateMetaTag = (attribute: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (description) {
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:description', description);
    }

    updateMetaTag('property', 'og:title', fullTitle);
    
    if (ogType) {
      updateMetaTag('property', 'og:type', ogType);
    }

    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    // Cleanup (Optional but good for single-page apps to avoid lingering tags)
    // For now we just let them persist or be overwritten by the next hook call.
  }, [title, description, ogType, image]);
};
