import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus } from '../../services/orderService';
import { createShippingOrder } from '../../services/shippingService';
import { refundOrder } from '../../services/paymentService';
import Button from '../../components/ui/Button/Button';
import styles from './OrderDetail.module.css';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{ trackingId: string; labelUrl: string } | null>(null);

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

  const handleShip = async () => {
    if (!order) return;
    setShippingLoading(true);
    try {
      const result = await createShippingOrder({
        orderId: order.id,
        customerName: order.userId,
        phone: order.phone || '9999999999',
        address: `${order.address?.street}, ${order.address?.city}`,
        items: order.items.map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        }))
      });
      
      setShippingInfo(result);
      await updateOrderStatus(order.id, 'shipped');
      setOrder((prev: any) => ({ ...prev, status: 'shipped' }));
      alert('Order shipped successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to ship order.');
    } finally {
      setShippingLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!order || !order.paymentId) return;
    if (!window.confirm(`Are you sure you want to refund ₹${order.total}?`)) return;

    setRefundLoading(true);
    try {
      await refundOrder(order.paymentId, order.total);
      await updateOrderStatus(order.id, 'refunded');
      setOrder((prev: any) => ({ ...prev, status: 'refunded' }));
      alert('Refund processed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to process refund.');
    } finally {
      setRefundLoading(false);
    }
  };

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

      {shippingInfo && (
        <div className={styles.section}>
          <h2>Tracking Info</h2>
          <p><strong>Tracking ID:</strong> {shippingInfo.trackingId}</p>
          <p><a href={shippingInfo.labelUrl} target="_blank" rel="noopener noreferrer">Download Label</a></p>
        </div>
      )}

      <div className={styles.actions}>
        <Button 
          onClick={handleShip} 
          loading={shippingLoading}
          disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'refunded'}
        >
          {order.status === 'shipped' ? 'Shipped' : 'Ship with Shadowfax'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleRefund}
          loading={refundLoading}
          disabled={order.status === 'refunded' || order.status === 'failed'}
        >
          {order.status === 'refunded' ? 'Refunded' : 'Issue Refund'}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
