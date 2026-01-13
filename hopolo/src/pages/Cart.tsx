import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button/Button";
import Card from "../components/ui/Card/Card";
import QuantitySelector from "../components/ui/QuantitySelector/QuantitySelector";
import styles from "./Cart.module.css";
import {
  subscribeToCart,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from "../services/cartService";
import { validatePromoCode } from "../services/promoService";

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToCart((cartItems) => {
      setItems(cartItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Recalculate discount if items change (e.g. if total drops below min purchase)
  useEffect(() => {
    if (appliedCode) {
      handleApplyPromo(appliedCode);
    }
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 5.99 : 0; // Flat rate for now
  const total = Math.max(0, subtotal + shipping - discount);

  const handleApplyPromo = async (code: string = promoCode) => {
    if (!code) return;
    setLoadingPromo(true);
    setPromoError("");

    try {
      const result = await validatePromoCode(code, subtotal);
      setDiscount(result.discount);
      setAppliedCode(code);
    } catch (err: any) {
      setPromoError(err.message);
      setDiscount(0);
      setAppliedCode("");
    } finally {
      setLoadingPromo(false);
    }
  };

  if (loading) return <div>Loading cart...</div>;

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
                  onChange={(q) => updateQuantity(item.product.id, q)}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.product.id)}
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
                onClick={() => handleApplyPromo()}
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
