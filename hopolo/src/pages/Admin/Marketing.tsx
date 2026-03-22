import React, { useState, useEffect } from "react";
import { useLoaderData, useSubmit, useActionData } from "react-router";
import { fetchPromoCodes, addPromoCode, deletePromoCode } from "../../services/promoService.server";
import { type PromoCode } from "../../services/promoService";
import { requireRole } from "../../lib/auth.server";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import styles from "./Marketing.module.css";

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const promos = await fetchPromoCodes();
  return { promos };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "add") {
      const code = formData.get("code") as string;
      const type = formData.get("type") as 'percentage' | 'fixed';
      const value = parseFloat(formData.get("value") as string);
      const minPurchase = formData.get("minPurchase") ? parseFloat(formData.get("minPurchase") as string) : undefined;
      
      await addPromoCode({ code, type, value, minPurchase });
      return { success: true };
    }
    if (intent === "delete") {
      const id = formData.get("id") as string;
      await deletePromoCode(id);
      return { success: true };
    }
    return { success: false, error: "Unknown intent" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const Marketing: React.FC = () => {
  const { promos: initialPromos } = useLoaderData() as { promos: PromoCode[] };
  const actionData = useActionData() as { success: boolean, error?: string };
  const submit = useSubmit();

  const [promos, setPromos] = useState<PromoCode[]>(initialPromos);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState<Omit<PromoCode, "id">>({
    code: "",
    value: 0,
    type: "percentage",
  });

  useEffect(() => {
    if (initialPromos) setPromos(initialPromos);
  }, [initialPromos]);

  useEffect(() => {
    if (actionData?.success) {
      setIsAdding(false);
      setNewPromo({ code: "", value: 0, type: "percentage" });
    }
  }, [actionData]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    submit(
      { 
        intent: "add", 
        code: newPromo.code, 
        type: newPromo.type, 
        value: newPromo.value.toString(),
        minPurchase: newPromo.minPurchase?.toString() || ""
      },
      { method: "post" }
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    submit({ intent: "delete", id }, { method: "post" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Marketing & Promos</h1>
        <Button onClick={() => setIsAdding(true)}>Create Promo</Button>
      </div>

      {isAdding && (
        <Card className={styles.formCard}>
          <form onSubmit={handleAdd} className={styles.form}>
            <Input
              label="Promo Code"
              placeholder="SUMMER20"
              value={newPromo.code}
              onChange={(e) =>
                setNewPromo({ ...newPromo, code: e.target.value })
              }
              required
            />
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Discount Type</label>
                <select
                  className={styles.select}
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
                label="Value"
                type="number"
                value={newPromo.value}
                onChange={(e) =>
                  setNewPromo({ ...newPromo, value: Number(e.target.value) })
                }
                required
              />
            </div>
            <Input
              label="Min. Purchase (Optional)"
              type="number"
              value={newPromo.minPurchase || ""}
              onChange={(e) =>
                setNewPromo({
                  ...newPromo,
                  minPurchase: Number(e.target.value) || undefined,
                })
              }
            />
            <div className={styles.formActions}>
              <Button type="submit">Save Promo</Button>
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className={styles.grid}>
        {promos.map((promo) => (
          <Card key={promo.id} className={styles.promoCard}>
            <div className={styles.promoInfo}>
              <div className={styles.promoCode}>{promo.code}</div>
              <div className={styles.promoValue}>
                {promo.type === "percentage"
                  ? `${promo.value}% Off`
                  : `$${promo.value} Off`}
              </div>
              {promo.minPurchase && (
                <div className={styles.promoMin}>Min. Spend: ${promo.minPurchase}</div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => handleDelete(promo.id!)}
              className={styles.deleteBtn}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Marketing;
