import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../../services/orderService';
import Button from '../../components/ui/Button/Button';
import styles from './OrderDetail.module.css';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (id) {
        const data = await fetchOrderById(id);
        setOrder(data);
      }
      setLoading(false);
    };
    loadOrder();
  }, [id]);

  if (loading) return <div className={styles.container}>Loading order details...</div>;
  if (!order) return <div className={styles.container}>Order not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order {order.id}</h1>
        <Button variant="secondary" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
      </div>

      <div className={styles.section}>
        <h2>Customer Information</h2>
        <p><strong>User ID:</strong> {order.userId}</p>
        <p><strong>Payment ID:</strong> {order.paymentId}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`${styles.status} ${styles[`status_${order.status}`]}`}>
            {order.status}
          </span>
        </p>
      </div>

      <div className={styles.section}>
        <h2>Shipping Address</h2>
        <p>{order.address?.street}</p>
        <p>{order.address?.city}, {order.address?.zip}</p>
      </div>

      <div className={styles.section}>
        <h2>Items</h2>
        {order.items?.map((item: any, index: number) => (
          <div key={index} className={styles.item}>
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className={styles.total}>
          Total: ₹{order.total}
        </div>
      </div>

      <div className={styles.actions}>
        <Button onClick={() => alert('Shipping not implemented in UI yet')}>Ship with Shadowfax</Button>
        <Button variant="secondary" onClick={() => alert('Refund not implemented in UI yet')}>Issue Refund</Button>
      </div>
    </div>
  );
};

export default OrderDetail;
