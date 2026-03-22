import React, { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { fetchAllOrders } from "../../services/orderService.server";
import { type Order } from "../../services/orderService";
import { requireRole } from "../../lib/auth.server";
import {
  aggregateRevenuePerDay,
  calculateTopProducts,
  calculateCategoryShare,
} from "../../lib/analyticsUtils";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import RevenueAreaChart from "../../components/ui/Charts/RevenueAreaChart";
import TopProductsBarChart from "../../components/ui/Charts/TopProductsBarChart";
import CategoryDonutChart from "../../components/ui/Charts/CategoryDonutChart";
import styles from "./Analytics.module.css";

type TimeRange = "today" | "7d" | "30d";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const orders = await fetchAllOrders();
  return { orders };
}

const Analytics: React.FC = () => {
  const { orders } = useLoaderData() as { orders: Order[] };
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const navigate = useNavigate();

  // Filter orders based on time range
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeRange === "today") {
      cutoff.setHours(0, 0, 0, 0);
    } else if (timeRange === "7d") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === "30d") {
      cutoff.setDate(now.getDate() - 30);
    }

    return orders.filter((o) => {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
      return orderDate >= cutoff && o.status !== "refunded" && o.status !== "failed";
    });
  }, [orders, timeRange]);

  // Calculations
  const revenueData = useMemo(() => aggregateRevenuePerDay(filteredOrders), [filteredOrders]);
  const topProducts = useMemo(() => calculateTopProducts(filteredOrders), [filteredOrders]);
  const categoryShare = useMemo(() => calculateCategoryShare(filteredOrders), [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = filteredOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <div className={styles.controls}>
          {(["today", "7d", "30d"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "primary" : "outline"}
              onClick={() => setTimeRange(range)}
              style={{ padding: "4px 12px", fontSize: "0.75rem" }}
            >
              {range === "today" ? "Today" : range === "7d" ? "7 Days" : "30 Days"}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <Card>
          <div className={styles.statLabel}>Revenue ({timeRange})</div>
          <div className={styles.statValue}>${totalRevenue.toFixed(2)}</div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Items Sold</div>
          <div className={styles.statValue}>{totalItems}</div>
        </Card>
        <Card>
          <div className={styles.statLabel}>Total Orders</div>
          <div className={styles.statValue}>{filteredOrders.length}</div>
        </Card>
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.fullWidth}>
          <h3>Revenue Over Time</h3>
          <div className={styles.chartContainer}>
            <RevenueAreaChart data={revenueData} />
          </div>
        </Card>

        <Card>
          <h3>Top Selling Products</h3>
          <div className={styles.chartContainer}>
            <TopProductsBarChart data={topProducts} />
          </div>
        </Card>

        <Card>
          <h3>Category Distribution</h3>
          <div className={styles.chartContainer}>
            <CategoryDonutChart data={categoryShare} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
