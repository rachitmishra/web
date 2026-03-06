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
    if (pathname.includes('/orders')) return { color: '#ecfeff', emoji: '📦' }; // Cyan 50
    if (pathname.includes('/inventory')) return { color: '#f0fdf4', emoji: '🏬' }; // Green 50
    if (pathname.includes('/marketing')) return { color: '#fff1f2', emoji: '📣' }; // Rose 50
    if (pathname.includes('/storefront')) return { color: '#faf5ff', emoji: '🎨' }; // Purple 50
    if (pathname.includes('/analytics')) return { color: '#fefce8', emoji: '📊' }; // Yellow 50
    if (pathname.includes('/invitations')) return { color: '#f5f3ff', emoji: '🤝' }; // Violet 50
    if (pathname.includes('/email-logs')) return { color: '#fff7ed', emoji: '✉️' }; // Orange 50
    if (pathname.includes('/seed')) return { color: '#f0fdfa', emoji: '🌱' }; // Teal 50
    return { color: '#f8fafc', emoji: '⚙️' }; // Slate 50
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
        onToggle={() => setIsCollapsed(prev => !prev)} 
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
