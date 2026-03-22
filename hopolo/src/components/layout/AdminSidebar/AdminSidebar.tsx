import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

const navItems = [
  { path: '/admin/orders', label: 'ORDERS', icon: 'shopping_cart' },
  { path: '/admin/inventory', label: 'INVENTORY', icon: 'inventory_2' },
  { path: '/admin/storefront', label: 'STOREFRONT', icon: 'search_gear' },
  { path: '/admin/analytics', label: 'DASHBOARD', icon: 'grid_view' },
  { path: '/admin/invitations', label: 'ACCESS_LOGS', icon: 'terminal' },
  { path: '/admin/email-logs', label: 'EMAIL_LOGS', icon: 'history' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside 
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
    >
      <div className={styles.logoWrapper}>
        <h1 className={styles.logo}>KINETIC_BRUTAL</h1>
        <p className={styles.version}>ADMIN_V1.0</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.();
            }}
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/logout" className={styles.navLink}>
          <span className={`material-symbols-outlined ${styles.icon}`}>logout</span>
          <span className={styles.label}>LOGOUT</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
