import React, { useState, useEffect } from 'react';
import { subscribeToStorefrontSettings, type StorefrontSettings } from '../../../services/storefrontService';
import styles from './PromoBanner.module.css';

const PromoBanner: React.FC = () => {
  const [settings, setSettings] = useState<StorefrontSettings | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToStorefrontSettings((newSettings) => {
      setSettings(newSettings);
    });
    return () => unsubscribe();
  }, []);

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
