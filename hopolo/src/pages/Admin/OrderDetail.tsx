import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, useSubmit, useActionData } from 'react-router';
import { fetchOrderById, updateOrderStatus } from '../../services/orderService.server';
import { type Order } from '../../services/orderService';
import { createShippingOrder } from '../../services/shippingService.server';
import { refundOrder } from '../../services/paymentService.server';
import { requireRole } from '../../lib/auth.server';
import Button from '../../components/ui/Button/Button';
import styles from './OrderDetail.module.css';

export async function loader({ request, params }: { request: Request, params: any }) {
  await requireRole(request, ['admin']);
  const orderId = params.id;
  if (!orderId) throw new Response("Order ID required", { status: 400 });
  
  const order = await fetchOrderById(orderId);
  if (!order) throw new Response("Order not found", { status: 404 });
  
  return { order };
}

export async function action({ request, params }: { request: Request, params: any }) {
  await requireRole(request, ['admin']);
  const { id: orderId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update-status") {
    const status = formData.get("status") as Order["status"];
    await updateOrderStatus(orderId, status);
    return { success: true };
  }

  if (intent === "ship-order") {
    const order = await fetchOrderById(orderId);
    if (!order) return { success: false, error: "Order not found" };
    
    try {
      const result = await createShippingOrder({
        orderId: order.id,
        customerName: order.userId,
        phone: (order as any).phone || '9999999999',
        address: `${order.address?.street}, ${order.address?.city}`,
        items: order.items.map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        }))
      });
      
      await updateOrderStatus(orderId, 'shipped');
      return { success: true, shippingInfo: result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  if (intent === "refund-order") {
    const order = await fetchOrderById(orderId);
    if (!order || !order.paymentId) return { success: false, error: "Order or payment ID not found" };
    
    try {
      await refundOrder(order.paymentId, order.total);
      await updateOrderStatus(orderId, 'refunded');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}

const OrderDetail: React.FC = () => {
  const { order: initialOrder } = useLoaderData() as { order: Order };
  const actionData = useActionData() as { success?: boolean, shippingInfo?: any, error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order>(initialOrder);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{ trackingId: string; labelUrl: string } | null>(null);

  useEffect(() => {
    if (initialOrder) setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    if (actionData?.success) {
      setShippingLoading(false);
      setRefundLoading(false);
      if (actionData.shippingInfo) {
        setShippingInfo(actionData.shippingInfo);
      }
    } else if (actionData?.error) {
      alert(actionData.error);
      setShippingLoading(false);
      setRefundLoading(false);
    }
  }, [actionData]);

  const handleShip = async () => {
    if (!order) return;
    setShippingLoading(true);
    submit({ intent: "ship-order" }, { method: "post" });
  };

  const handleRefund = async () => {
    if (!order || !order.paymentId) return;
    if (!window.confirm(`Are you sure you want to refund ₹${order.total}?`)) return;

    setRefundLoading(true);
    submit({ intent: "refund-order" }, { method: "post" });
  };

  if (!order) return <div className={styles.container}>Order not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" onClick={() => navigate('/admin/orders')} style={{ marginBottom: 'var(--spacing-4)' }}>
          &larr; Back to Orders
        </Button>
        <h1>Order {order.id}</h1>
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
