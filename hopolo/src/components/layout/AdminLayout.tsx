import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Default to hidden on mobile
      } else {
        setIsCollapsed(false); // Default to visible on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsCollapsed(true)} 
        />
      )}

      <AdminSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />

      <div className={styles.mainWrapper}>
        {/* Mobile Header */}
        {isMobile && (
          <header className={styles.mobileHeader}>
            <button 
              className={styles.hamburger} 
              onClick={() => setIsCollapsed(false)}
              aria-label="Open Navigation"
            >
              <Menu size={24} />
            </button>
            <span className={styles.mobileLogo}>Hopolo Admin</span>
          </header>
        )}

        <main className={styles.mainContent}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
