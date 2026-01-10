import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/Input/Input';
import styles from './Checkout.module.css';
import { subscribeToCart, CartItem } from '../services/cartService';
import { getUserProfile, Address } from '../services/profileService';
import { auth } from '../lib/firebase';

const Checkout: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [newAddress, setNewAddress] = useState<Address>({ street: '', city: '', state: '', zip: '' });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    
    const fetchAddresses = async () => {
      const user = auth.currentUser;
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile?.addresses) {
          setAddresses(profile.addresses);
          if (profile.addresses.length > 0) {
            setSelectedAddressIndex(0);
          } else {
            setIsAddingNew(true);
          }
        } else {
          setIsAddingNew(true);
        }
      }
    };
    fetchAddresses();

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
            <div className={styles.addressList}>
              {addresses.map((addr, index) => (
                <div 
                  key={index}
                  className={`${styles.addressCard} ${selectedAddressIndex === index ? styles.selectedAddress : ''}`}
                  onClick={() => { setSelectedAddressIndex(index); setIsAddingNew(false); }}
                >
                  <div>{addr.street}</div>
                  <div>{addr.city}, {addr.state} {addr.zip}</div>
                </div>
              ))}
              
              <Button variant="outline" onClick={() => setIsAddingNew(true)}>
                + Add New Address
              </Button>
            </div>

            {isAddingNew && (
              <div className={styles.newAddressForm}>
                <h3>New Address</h3>
                <Input 
                  label="Street Address" 
                  value={newAddress.street} 
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} 
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <Input 
                    label="City" 
                    value={newAddress.city} 
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} 
                  />
                  <Input 
                    label="State" 
                    value={newAddress.state || ''} 
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} 
                  />
                </div>
                <Input 
                  label="ZIP Code" 
                  value={newAddress.zip || ''} 
                  onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} 
                />
              </div>
            )}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#eee' }}>
                      🛍️
                    </div>
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