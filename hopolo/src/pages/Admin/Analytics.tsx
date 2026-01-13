import React, { useEffect, useState, useMemo } from "react";
import { fetchAllOrders, type Order } from "../../services/orderService";
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
import { useNavigate } from "react-router-dom";
import styles from "./Analytics.module.css";

type TimeRange = "today" | "7d" | "30d";

const Analytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("30d");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const rangeMs = {
      today: 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    }[range];

    return orders.filter((order) => {
      const date = order.createdAt?.toDate
        ? order.createdAt.toDate()
        : new Date(0);
      return now.getTime() - date.getTime() <= rangeMs;
    });
  }, [orders, range]);

  const revenueData = useMemo(
    () => aggregateRevenuePerDay(filteredOrders),
    [filteredOrders]
  );
  const topProductsData = useMemo(
    () => calculateTopProducts(filteredOrders),
    [filteredOrders]
  );
  const categoryData = useMemo(
    () => calculateCategoryShare(filteredOrders),
    [filteredOrders]
  );

  if (loading)
    return <div className={styles.container}>Loading analytics...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <div style={{ display: "flex", gap: "var(--spacing-4)" }}>
          <div className={styles.rangeToggles}>
            {(["today", "7d", "30d"] as TimeRange[]).map((r) => (
              <button
                key={r}
                className={`${styles.rangeBtn} ${
                  range === r ? styles.activeRange : ""
                }`}
                onClick={() => setRange(r)}
              >
                {r === "today"
                  ? "Today"
                  : r === "7d"
                  ? "Last 7 Days"
                  : "Last 30 Days"}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className={styles.grid}>
        <Card className={`${styles.chartCard} ${styles.fullWidth}`}>
          <div className={styles.chartTitle}>Revenue Trend</div>
          <RevenueAreaChart data={revenueData} />
        </Card>

        <Card className={styles.chartCard}>
          <div className={styles.chartTitle}>Top Products</div>
          <TopProductsBarChart data={topProductsData} />
        </Card>

        <Card className={styles.chartCard}>
          <div className={styles.chartTitle}>Category Distribution</div>
          <CategoryDonutChart data={categoryData} />
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
