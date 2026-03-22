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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders</h1>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.statLabel}>Total Sales</div>
          <div data-testid="total-sales" className={styles.statValue}>
            ${totalSales.toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Avg Order Value</div>
          <div data-testid="avg-order-value" className={styles.statValue}>
            ${aov.toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Total Orders</div>
          <div data-testid="total-orders" className={styles.statValue}>
            {totalOrders}
          </div>
        </Card>
      </div>

      <Card>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Order ID</th>
                <th className={styles.th}>User ID</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={`${styles.td} ${styles.orderId}`}>
                    {order.id}
                  </td>
                  <td className={`${styles.td} ${styles.userId}`}>
                    {order.userId}
                  </td>
                  <td className={styles.td}>
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className={`${styles.td} ${styles.amount}`}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.statusBadge} ${
                        order.status === "paid" ? styles.statusPaid : styles.statusOther
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <Button
                      variant="outline"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className={styles.empty}>
            No orders found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Orders;
