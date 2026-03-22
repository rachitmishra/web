import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { subscribeToCart, type CartItem } from '../../../services/cartService';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { ShoppingBag } from 'lucide-react';
import { signOutUser } from '../../../services/authService';
import LoginDialog from '../../ui/Auth/LoginDialog';

interface HeaderProps {
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const [itemCount, setItemCount] = useState(0);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (isHome) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
    } else {
      setIsScrolled(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    const unsubscribeCart = subscribeToCart((items: CartItem[]) => {
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      setItemCount(totalCount);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribeCart();
      unsubscribeAuth();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      
      // Call server-side logout to clear HttpOnly cookie
      const formData = new FormData();
      await fetch('/logout', { method: 'POST', body: formData });
      
      navigate('/login');
      window.location.reload(); // Ensure all state is reset
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isHome && !isScrolled ? styles.transparent : ''} ${isScrolled ? styles.scrolled : ''}`}>
        <Link to="/" className={styles.logo}>
          Hopolo
        </Link>
        
        <div className={styles.actions}>
          {user ? (
            <>
              <Link to="/profile" className={styles.link}>Account</Link>
              <button onClick={handleSignOut} className={styles.linkButton}>Sign Out</button>
            </>
          ) : (
            !isLoginPage && (
              <button 
                onClick={() => setIsLoginOpen(true)} 
                className={styles.linkButton}
              >
                Sign In
              </button>
            )
          )}

          {!isAdminPage && (
            <button className={styles.cartButton} onClick={onOpenCart} aria-label="Shopping Cart">
              <ShoppingBag size={20} />
              {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
            </button>
          )}
        </div>
      </header>

      <LoginDialog 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};

export default Header;
