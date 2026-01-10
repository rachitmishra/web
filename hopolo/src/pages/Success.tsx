import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Success.module.css';

const Success: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.icon}>🎉</div>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase. We've received your order and are processing it.</p>
      
      <Card>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Order ID</div>
        <div className={styles.orderId}>{orderId}</div>
      </Card>

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
