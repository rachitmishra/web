import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import MiniCart from '../ui/MiniCart/MiniCart';
import styles from './MainLayout.module.css';
import { subscribeToCart } from '../../services/cartService';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToCart((items) => {
      const currentCount = items.reduce((acc, item) => acc + item.quantity, 0);
      // Auto-open if items increased (conceptual, maybe annoying, but spec says 'Auto-open drawer when an item is added')
      if (currentCount > prevItemCount) {
        setIsCartOpen(true);
      }
      setPrevItemCount(currentCount);
    });
    return () => unsubscribe();
  }, [prevItemCount]);

  return (
    <div className={styles.container}>
      <Header onOpenCart={() => setIsCartOpen(true)} />
      
      <main className={styles.main}>
        {children}
      </main>

      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Hopolo. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
