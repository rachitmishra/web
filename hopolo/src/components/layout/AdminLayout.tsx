import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, redirect } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import styles from './AdminLayout.module.css';
import { requireRole } from '../../lib/auth.server';
import AdminRoute from '../ui/Auth/AdminRoute';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  try {
    await requireRole(request, ['admin']);
    return null;
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      return redirect(`/login?from=${encodeURIComponent(url.pathname)}`);
    }
    // For other cases like 403 (Forbidden), we redirect to home
    console.warn("[AdminLayout] Unauthorized access attempt:", url.pathname);
    return redirect("/");
  }
}

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
    <AdminRoute>
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
          <main className={styles.mainContent}>
            <div className={styles.container}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;
