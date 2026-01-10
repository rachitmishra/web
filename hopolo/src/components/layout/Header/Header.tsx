import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { subscribeToCart, CartItem } from '../../../services/cartService';

interface HeaderProps {
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToCart((items: CartItem[]) => {
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      setItemCount(totalCount);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Hopolo
      </Link>
      
      <div className={styles.actions}>
        <button className={styles.cartButton} onClick={onOpenCart} aria-label="Shopping Cart">
          🛒
          {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;
