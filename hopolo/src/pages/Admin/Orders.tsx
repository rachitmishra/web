import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { fetchAllOrders } from "../../services/orderService.server";
import { type Order } from "../../services/orderService";
import { requireRole } from "../../lib/auth.server";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import styles from "./Orders.module.css";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const orders = await fetchAllOrders();
  return { orders };
}

const Orders: React.FC = () => {
  const { orders } = useLoaderData() as { orders: Order[] };
  const navigate = useNavigate();

  const totalOrders = orders.length;
  const totalSales = orders
    .filter((o) => o.status !== "refunded")
    .reduce((sum, o) => sum + o.total, 0);
  const aov =
    totalOrders > 0
      ? totalSales / (orders.filter((o) => o.status !== "refunded").length || 1)
      : 0;

  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(orders[0]?.id || null);
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Order Control / Logistics</h2>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="SEARCH ORDERS..."
              className={styles.searchInput}
            />
            <span className="material-symbols-outlined absolute right-3 top-2 text-black">search</span>
          </div>
          <button className={styles.actionBtnPrimary}><span className="material-symbols-outlined">doorbell</span></button>
          <button className={styles.actionBtnSecondary}><span className="material-symbols-outlined">verified_user</span></button>
        </div>
      </header>

      <div className={styles.splitPane}>
        {/* Left Pane: Order List */}
        <section className={styles.orderListPane}>
          <div className={styles.listTabs}>
            <button className={styles.tabActive}>All Orders</button>
            <button className={styles.tabInactive}>Pending</button>
            <button className={styles.tabInactive}>Refunded</button>
          </div>
          <div className={styles.orderList}>
            {orders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const dateStr = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : "N/A";
              return (
                <div
                  key={order.id}
                  className={`${styles.orderListItem} ${isSelected ? styles.orderListItemSelected : ''}`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.itemOrderId}>#{order.id.toUpperCase()}</span>
                    <span className={`${styles.itemStatus} ${order.status === 'paid' ? styles.statusProcessing : order.status === 'refunded' ? styles.statusRefunded : styles.statusDelivered}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.itemDetails}>
                    <div>
                      <p className={styles.itemUser}>{order.shippingAddress?.name || order.userId}</p>
                      <p className={styles.itemDate}>{dateStr}</p>
                    </div>
                    <p className={styles.itemTotal}>${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className={styles.empty}>No orders found.</div>
            )}
          </div>
        </section>

        {/* Right Pane: Order Details */}
        <section className={styles.orderDetailsPane}>
          {selectedOrder ? (
            <div className={styles.detailsContent}>
              <div className={styles.detailsHeader}>
                <div>
                  <h3 className={styles.detailsTitle}>ORDER #{selectedOrder.id.toUpperCase()}</h3>
                  <p className={styles.detailsSubtitle}>
                    Placed on {selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : "N/A"}
                  </p>
                </div>
                <div className={styles.detailsActions}>
                  <button className={styles.btnSecondary} onClick={() => navigate(`/admin/orders/${selectedOrder.id}`)}>View Full Details</button>
                  <button className={styles.btnDanger}>Issue Refund</button>
                </div>
              </div>

              <div className={styles.detailsGrid}>
                {/* Customer Details */}
                <div className={styles.brutalCard}>
                  <h4 className={styles.cardTitle}>Shipping Details</h4>
                  <div className={styles.cardBody}>
                    <p><strong className={styles.cardLabel}>Recipient:</strong> {selectedOrder.shippingAddress?.name || "N/A"}</p>
                    <p><strong className={styles.cardLabel}>Address:</strong> {selectedOrder.shippingAddress?.line1}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postal_code}</p>
                    <p><strong className={styles.cardLabel}>Phone:</strong> {selectedOrder.shippingAddress?.phone || "N/A"}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className={styles.brutalCard}>
                  <h4 className={styles.cardTitle}>Order Summary</h4>
                  <div className={styles.cardBody}>
                    <div className={styles.summaryRow}><span>Subtotal:</span><span>${selectedOrder.total.toFixed(2)}</span></div>
                    <div className={styles.summaryRow}><span>Shipping:</span><span>$0.00</span></div>
                    <div className={styles.summaryRow}><span>Tax:</span><span>$0.00</span></div>
                    <div className={styles.summaryTotal}>
                      <span>TOTAL:</span><span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <p className={styles.paymentBadge}>PAID VIA SECURE_CHECKOUT (TXN_{selectedOrder.paymentIntentId?.substring(0, 5) || "N/A"})</p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className={styles.itemsTableWrapper}>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th className="text-left">Item</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className={styles.itemCell}>
                          <div className={styles.itemImageWrapper}>
                            <img src={item.product?.images?.[0] || 'https://via.placeholder.com/64'} alt="Product" />
                          </div>
                          <div>
                            <p className={styles.itemName}>{item.product?.name || "Unknown Item"}</p>
                            <span className={styles.itemVariant}>SIZE: {item.variant?.size || "OS"}</span>
                          </div>
                        </td>
                        <td className="text-center font-bold">{item.quantity.toString().padStart(2, '0')}</td>
                        <td className="text-right">${((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={styles.emptySelection}>Select an order to view details</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Orders;
