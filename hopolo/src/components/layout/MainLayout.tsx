import React from 'react';
import Header from './Header/Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      
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
