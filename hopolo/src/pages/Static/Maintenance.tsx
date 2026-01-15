import React from 'react';
import styles from './Maintenance.module.css';

const Maintenance: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>Hopolo</div>
        <div className={styles.emoji}>✨</div>
        <h1 className={styles.title}>We'll Be Back Soon</h1>
        <p className={styles.message}>
          Our boutique is currently undergoing scheduled maintenance to bring you an even better shopping experience. 
          Please check back shortly!
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          &copy; {new Date().getFullYear()} Hopolo. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
