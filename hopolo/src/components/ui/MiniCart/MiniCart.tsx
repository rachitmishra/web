import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MiniCart.module.css';
import Button from '../Button/Button';
import { subscribeToCart, CartItem } from '../../../services/cartService';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    return () => unsubscribe();
  }, []);

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} 
        onClick={onClose} 
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2>Your Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
              Your cart is empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button variant="primary" onClick={() => { navigate('/cart'); onClose(); }}>
              View Full Cart
            </Button>
            <Button variant="outline" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
