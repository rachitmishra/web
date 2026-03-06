import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const getRouteTheme = (pathname: string) => {
    if (pathname.includes('/orders')) return { color: '#e0f2fe', emoji: '📦' }; // Light Blue
    if (pathname.includes('/inventory')) return { color: '#f0fdf4', emoji: '🏬' }; // Light Green
    if (pathname.includes('/marketing')) return { color: '#fdf2f8', emoji: '📣' }; // Light Pink
    if (pathname.includes('/storefront')) return { color: '#f5f3ff', emoji: '🎨' }; // Light Purple
    if (pathname.includes('/analytics')) return { color: '#fefce8', emoji: '📈' }; // Light Yellow
    if (pathname.includes('/invitations')) return { color: '#eef2ff', emoji: '✉️' }; // Light Indigo
    if (pathname.includes('/email-logs')) return { color: '#fff7ed', emoji: '📧' }; // Light Orange
    if (pathname.includes('/seed')) return { color: '#f0fdfa', emoji: '🌱' }; // Light Teal
    return { color: '#f3f4f6', emoji: '⚙️' }; // Default
  };

  const currentTheme = getRouteTheme(location.pathname);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse sidebar on route change for all devices
  useEffect(() => {
    setIsCollapsed(true);
  }, [location.pathname]);

  return (
    <div className={styles.adminLayout} style={{ '--admin-bg-color': currentTheme.color } as React.CSSProperties}>
      {/* Background Illustration */}
      <div className={styles.bgIllustration} aria-hidden="true">
        {currentTheme.emoji}
      </div>

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
        onItemClick={() => setIsCollapsed(true)}
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
