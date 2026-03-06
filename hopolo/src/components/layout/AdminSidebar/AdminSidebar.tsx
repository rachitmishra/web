import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Store, 
  Megaphone, 
  Palette, 
  BarChart3, 
  Mail, 
  History, 
  Leaf,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

const navItems = [
  { path: '/admin/orders', label: 'Orders', icon: <Package size={20} /> },
  { path: '/admin/inventory', label: 'Inventory', icon: <Store size={20} /> },
  { path: '/admin/marketing', label: 'Marketing', icon: <Megaphone size={20} /> },
  { path: '/admin/storefront', label: 'Storefront', icon: <Palette size={20} /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { path: '/admin/invitations', label: 'Invitations', icon: <Mail size={20} /> },
  { path: '/admin/email-logs', label: 'Email Logs', icon: <History size={20} /> },
  { path: '/admin/seed', label: 'Seed Data', icon: <Leaf size={20} /> },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        {!isCollapsed && <span className={styles.logo}>Hopolo Admin</span>}
        <button 
          onClick={onToggle} 
          className={styles.toggleBtn}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onItemClick}
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
