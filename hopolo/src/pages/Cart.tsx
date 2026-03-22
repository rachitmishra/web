import React, { useState, useEffect } from "react";
import { Link, useLoaderData, useSubmit, useActionData } from "react-router-dom";
import Button from "../components/ui/Button/Button";
import Card from "../components/ui/Card/Card";
import QuantitySelector from "../components/ui/QuantitySelector/QuantitySelector";
import styles from "./Cart.module.css";
import { type CartItem } from "../services/cartService";
import { getCart, removeFromCart, updateQuantity } from "../services/cartService.server";
import { validatePromoCode } from "../services/promoService.server";
import { getSessionIdFromRequest } from "../lib/session";

export async function loader({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const items = await getCart(sessionId);
  return { items };
}

export async function action({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "remove") {
    const productId = formData.get("productId") as string;
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    await removeFromCart(sessionId, productId, { size, color });
    return { success: true };
  }

  if (intent === "update-quantity") {
    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    await updateQuantity(sessionId, productId, quantity, { size, color });
    return { success: true };
  }

  if (intent === "apply-promo") {
    const code = formData.get("code") as string;
    const subtotal = parseFloat(formData.get("subtotal") as string);
    try {
      const result = await validatePromoCode(code, subtotal);
      return { success: true, promo: { code, ...result } };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}

const Cart: React.FC = () => {
  const { items: initialItems } = useLoaderData() as { items: CartItem[] };
  const actionData = useActionData() as { success: boolean; promo?: any; error?: string };
  const submit = useSubmit();

  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  // Sync items when loader data changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (actionData) {
      setLoadingPromo(false);
      if (actionData.promo) {
        setDiscount(actionData.promo.discount);
        setAppliedCode(actionData.promo.code);
        setPromoError("");
      } else if (actionData.error) {
        setPromoError(actionData.error);
        setDiscount(0);
        setAppliedCode("");
      }
    }
  }, [actionData]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleRemove = (item: CartItem) => {
    submit(
      { 
        intent: "remove", 
        productId: item.product.id, 
        size: item.selectedSize || "", 
        color: item.selectedColor || "" 
      },
      { method: "post" }
    );
  };

  const handleUpdateQuantity = (item: CartItem, q: number) => {
    submit(
      { 
        intent: "update-quantity", 
        productId: item.product.id, 
        quantity: q.toString(),
        size: item.selectedSize || "", 
        color: item.selectedColor || "" 
      },
      { method: "post" }
    );
  };

  const handleApplyPromo = () => {
    setLoadingPromo(true);
    submit(
      { intent: "apply-promo", code: promoCode, subtotal: subtotal.toString() },
      { method: "post" }
    );
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Shopping Cart</h1>
        <div className={styles.emptyState}>
          <p>Your cart is empty.</p>
          <Link to="/">
            <Button style={{ marginTop: "var(--spacing-4)" }}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>

      <div className={styles.cartGrid}>
        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className={styles.item}>
              <div className={styles.itemImage}>
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      background: "#eee",
                    }}
                  >
                    🛍️
                  </div>
                )}
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.product.name}</div>
                {item.selectedSize && (
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Size: {item.selectedSize}
                  </div>
                )}
                {item.selectedColor && (
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Color: {item.selectedColor}
                  </div>
                )}
                <div className={styles.itemPrice}>
                  ${item.product.price.toFixed(2)}
                </div>
              </div>

              <div className={styles.itemActions}>
                <QuantitySelector
                  quantity={item.quantity}
                  onChange={(q) => handleUpdateQuantity(item, q)}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <Card className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className={`${styles.summaryRow} ${styles.discountRow}`}>
              <span>Discount ({appliedCode})</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className={styles.promoSection}>
            <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              Promo Code
            </div>
            <div className={styles.promoInputGroup}>
              <input
                className={styles.promoInput}
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button
                variant="outline"
                style={{ padding: "8px 12px" }}
                onClick={handleApplyPromo}
                loading={loadingPromo}
              >
                Apply
              </Button>
            </div>
            {promoError && (
              <div
                style={{
                  color: "var(--color-danger)",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                }}
              >
                {promoError}
              </div>
            )}
          </div>

          <Link to="/checkout" state={{ discount, appliedCode }}>
            <Button style={{ marginTop: "var(--spacing-4)", width: "100%" }}>
              Proceed to Checkout
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
