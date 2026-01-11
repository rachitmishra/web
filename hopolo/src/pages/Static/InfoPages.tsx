import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './InfoPages.module.css';

const InfoPages: React.FC = () => {
  const { pathname } = useLocation();
  
  const getContent = () => {
    switch (pathname) {
      case '/about':
        return {
          title: 'About Us',
          content: 'Hopolo is a minimalist boutique focused on unique, high-quality products. We believe in playful design and professional service.'
        };
      case '/shipping':
        return {
          title: 'Shipping Policy',
          content: 'We ship worldwide. Orders are typically processed within 1-2 business days. Delivery times vary by location, usually 3-7 business days.'
        };
      case '/contact':
        return {
          title: 'Contact Us',
          content: 'Have questions? Reach out to us at support@hopolo.com or follow us on social media.'
        };
      default:
        return { title: 'Information', content: 'Page not found.' };
    }
  };

  const { title, content } = getContent();

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default InfoPages;
