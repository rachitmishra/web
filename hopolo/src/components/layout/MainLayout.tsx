import React from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Placeholder Logo */}
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
          Hopolo
        </div>
        {/* Placeholder Navigation */}
        <nav>
          {/* Links would go here */}
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Hopolo. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
