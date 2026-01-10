import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import QuantitySelector from '../components/ui/QuantitySelector/QuantitySelector';
import styles from './Cart.module.css';
import { subscribeToCart, CartItem, updateQuantity, removeFromCart } from '../services/cartService';

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    return () => unsubscribe();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
        <h1>Your Cart is Empty</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-6)' }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button onClick={() => navigate('/')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>

      <div className={styles.cartGrid}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.product.id} className={styles.item}>
              <div className={styles.itemImage}>
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee' }}>
                    🛍️
                  </div>
                )}
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.product.name}</div>
                <div className={styles.itemPrice}>${item.product.price.toFixed(2)}</div>
              </div>
              <div className={styles.itemActions}>
                <QuantitySelector 
                  quantity={item.quantity} 
                  onChange={(q) => updateQuantity(item.product.id, q)} 
                />
                <button 
                  className={styles.removeButton} 
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <Card className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
