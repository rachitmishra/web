import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Checkout.module.css';
import { subscribeToCart, CartItem } from '../services/cartService';

const Checkout: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    return () => unsubscribe();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      <div className={styles.checkoutGrid}>
        <div className={styles.forms}>
          <Card>
            <h2>Shipping Address</h2>
            <p>Address selection coming in next task...</p>
          </Card>
        </div>

        <Card className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.product.name}</div>
                  <div className={styles.itemPrice}>
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>
            Pay Now
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
