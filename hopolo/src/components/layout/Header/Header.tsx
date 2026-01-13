import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { subscribeToCart, type CartItem } from '../../../services/cartService';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface HeaderProps {
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const [itemCount, setItemCount] = useState(0);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const navigate = useNavigate();

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

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Hopolo
      </Link>
      
      <div className={styles.actions}>
        {user ? (
          <Link to="/profile" className={styles.link}>Account</Link>
        ) : (
          <Link to="/login" className={styles.link}>Sign In</Link>
        )}

        <button className={styles.cartButton} onClick={onOpenCart} aria-label="Shopping Cart">
          🛒
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;