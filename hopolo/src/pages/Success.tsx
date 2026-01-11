import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Success.module.css';
import { fetchOrderById } from '../services/orderService';

const Success: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (orderId) {
        try {
          const data = await fetchOrderById(orderId);
          setOrder(data);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    loadOrder();
  }, [orderId]);

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🎉</div>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase. We've received your order and are processing it.</p>
      
      <Card>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Order ID</div>
        <div className={styles.orderId}>{orderId}</div>
      </Card>

      {loading ? (
        <div>Loading details...</div>
      ) : order ? (
        <div className={styles.orderSummary}>
          <Card>
            <h3>Order Summary</h3>
            <div className={styles.itemList}>
              {order.items?.map((item: any, i: number) => (
                <div key={i} className={styles.item}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            {order.address && (
              <div className={styles.address}>
                <strong>Shipping To:</strong><br/>
                {order.address.street}, {order.address.city} {order.address.zip}
              </div>
            )}
          </Card>
        </div>
      ) : null}

      <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-4)' }}>
        <Button variant="outline" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
        <Button variant="primary" onClick={() => navigate('/profile')}>
          View Order History
        </Button>
      </div>
    </div>
  );
};

export default Success;
