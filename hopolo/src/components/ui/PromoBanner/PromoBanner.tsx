import React from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { type StorefrontSettings } from '../../../services/storefrontService';
import styles from './PromoBanner.module.css';

const PromoBanner: React.FC = () => {
  const rootData = useRouteLoaderData('root') as { 
    settings: StorefrontSettings 
  } | undefined;

  const settings = rootData?.settings;

  if (!settings || !settings.bannerVisible || !settings.bannerText) {
    return null;
  }

  const bannerContent = (
    <div 
      className={styles.banner} 
      style={{ backgroundColor: settings.bannerColor || 'var(--color-primary)' }}
    >
      {settings.bannerText}
    </div>
  );

  if (settings.bannerLink) {
    return (
      <a href={settings.bannerLink} className={styles.bannerLink}>
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};

export default PromoBanner;
