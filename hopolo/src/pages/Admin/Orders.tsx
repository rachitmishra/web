import React, { useState, useEffect } from 'react';
import { fetchAllOrders, Order } from '../../services/orderService';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <h1>Admin Orders</h1>

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: 'var(--spacing-4)' }}>Order ID</th>
              <th style={{ padding: 'var(--spacing-4)' }}>User ID</th>
              <th style={{ padding: 'var(--spacing-4)' }}>Date</th>
              <th style={{ padding: 'var(--spacing-4)' }}>Total</th>
              <th style={{ padding: 'var(--spacing-4)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-4)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: 'var(--spacing-4)', fontFamily: 'monospace' }}>{order.id}</td>
                <td style={{ padding: 'var(--spacing-4)', fontSize: '0.875rem' }}>{order.userId}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 600 }}>${order.total.toFixed(2)}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem',
                    backgroundColor: order.status === 'paid' ? '#d1fae5' : '#f3f4f6',
                    color: order.status === 'paid' ? '#065f46' : '#374151'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <Button variant="outline" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
            No orders found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
