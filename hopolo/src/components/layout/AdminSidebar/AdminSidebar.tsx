import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/admin/orders', label: 'Orders', icon: '📦' },
  { path: '/admin/inventory', label: 'Inventory', icon: '🏬' },
  { path: '/admin/marketing', label: 'Marketing', icon: '📣' },
  { path: '/admin/storefront', label: 'Storefront', icon: '🎨' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { path: '/admin/invitations', label: 'Invitations', icon: '✉️' },
  { path: '/admin/email-logs', label: 'Email Logs', icon: '📧' },
  { path: '/admin/seed', label: 'Seed Data', icon: '🌱' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        {!isCollapsed && <span className={styles.logo}>Hopolo Admin</span>}
        <button 
          onClick={onToggle} 
          className={styles.toggleBtn}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!isCollapsed && <span className={styles.label}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
