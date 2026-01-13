import React, { useEffect, useState } from "react";
import {
  fetchPromoCodes,
  addPromoCode,
  deletePromoCode,
  type PromoCode,
} from "../../services/promoService";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { useNavigate } from "react-router-dom";
import styles from "./Marketing.module.css";

const Marketing: React.FC = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState<Omit<PromoCode, "id">>({
    code: "",
    value: 0,
    type: "percentage",
    minPurchase: 0,
  });

  const navigate = useNavigate();

  const loadPromos = async () => {
    try {
      const data = await fetchPromoCodes();
      setPromos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPromoCode(newPromo as PromoCode);
      setIsAdding(false);
      setNewPromo({ code: "", value: 0, type: "percentage", minPurchase: 0 });
      loadPromos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      try {
        await deletePromoCode(id);
        loadPromos();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className={styles.container}>Loading promos...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Marketing Dashboard</h1>
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Cancel" : "Add Promo Code"}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card>
          <form className={styles.form} onSubmit={handleSave}>
            <h3>New Promo Code</h3>
            <div className={styles.row}>
              <Input
                label="Code"
                value={newPromo.code}
                onChange={(e) =>
                  setNewPromo({ ...newPromo, code: e.target.value })
                }
                required
              />
              <Input
                label="Value"
                type="number"
                value={newPromo.value.toString()}
                onChange={(e) =>
                  setNewPromo({
                    ...newPromo,
                    value: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className={styles.row}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Type
                </label>
                <select
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                  value={newPromo.type}
                  onChange={(e) =>
                    setNewPromo({ ...newPromo, type: e.target.value as any })
                  }
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <Input
                label="Min Purchase ($)"
                type="number"
                value={newPromo.minPurchase?.toString() || "0"}
                onChange={(e) =>
                  setNewPromo({
                    ...newPromo,
                    minPurchase: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <Button type="submit">Save Promo</Button>
          </form>
        </Card>
      )}

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Code</th>
              <th className={styles.th}>Discount</th>
              <th className={styles.th}>Min. Order</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo.id}>
                <td className={styles.td}>
                  <strong>{promo.code}</strong>
                </td>
                <td className={styles.td}>
                  {promo.type === "percentage"
                    ? `${promo.value}%`
                    : `$${promo.value.toFixed(2)}`}
                </td>
                <td className={styles.td}>
                  ${promo.minPurchase?.toFixed(2) || "0.00"}
                </td>
                <td className={styles.td}>
                  <Button
                    variant="outline"
                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    onClick={() => handleDelete(promo.id!)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promos.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--spacing-8)",
              color: "var(--color-text-muted)",
            }}
          >
            No promo codes found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Marketing;
