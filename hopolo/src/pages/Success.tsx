import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Success.module.css';
import { fetchOrderById } from '../services/orderService.server';
import { type Order } from '../services/orderService';

export async function loader({ params }: { params: any }) {
  const { orderId } = params;
  if (!orderId) throw new Response("Order ID required", { status: 400 });
  
  const order = await fetchOrderById(orderId);
  return { order };
}

const Success: React.FC = () => {
  const { order } = useLoaderData() as { order: Order | null };
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🎉</div>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase. We've received your order and are processing it.</p>
      
      <Card>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Order ID</div>
        <div className={styles.orderId}>{order?.id}</div>
      </Card>

      {order ? (
        <div className={styles.orderSummary}>
          <Card>
            <h3>Order Summary</h3>
            <div className={styles.itemList}>
              {order.items?.map((item: any, i: number) => (
                <div key={i} className={styles.item}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
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
      ) : (
        <div>Order details not found.</div>
      )}

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
