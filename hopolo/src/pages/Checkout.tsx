import React, { useState, useEffect } from "react";
import { useLoaderData, useSubmit, useActionData, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card/Card";
import Button from "../components/ui/Button/Button";
import Input from "../components/ui/Input/Input";
import styles from "./Checkout.module.css";
import { type CartItem } from "../services/cartService";
import { getCart, clearCart } from "../services/cartService.server";
import { getSecureProfile } from "../services/profileService.server";
import { createOrder } from "../services/orderService.server";
import { type Address } from "../services/profileService";
import { auth } from "../lib/firebase";
import { getAuthenticatedUser } from "../lib/auth.server";
import { getSessionIdFromRequest } from "../lib/session";
import { loadRazorpayScript } from "../services/paymentService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function loader({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const user = await getAuthenticatedUser(request);
  
  const [items, profile] = await Promise.all([
    getCart(sessionId),
    user ? getSecureProfile(user.uid) : Promise.resolve(null)
  ]);

  return { items, addresses: profile?.addresses || [], user };
}

export async function action({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const user = await getAuthenticatedUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create-order") {
    const orderDataJson = formData.get("orderData") as string;
    try {
      const orderData = JSON.parse(orderDataJson);
      const orderId = await createOrder(orderData);
      await clearCart(sessionId);
      return { success: true, orderId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}

const Checkout: React.FC = () => {
  const { items, addresses, user } = useLoaderData() as { items: CartItem[], addresses: Address[], user: any };
  const actionData = useActionData() as { success: boolean, orderId?: string, error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(addresses.length > 0 ? 0 : -1);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData?.success && actionData.orderId) {
      navigate(`/checkout/success/${actionData.orderId}`);
    }
  }, [actionData, navigate]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    const finalAddress = isAddingNew ? newAddress : addresses[selectedAddressIndex];
    if (!finalAddress.street || !finalAddress.city || !finalAddress.zip) {
      alert("Please provide a complete shipping address.");
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount: Math.round(total * 100),
      currency: "USD",
      name: "Hopolo",
      description: "Order Payment",
      handler: function (response: any) {
        console.log("Payment Success:", response);
        submit(
          { 
            intent: "create-order", 
            orderData: JSON.stringify({
              userId: user?.uid || 'anonymous',
              userEmail: user?.email || '',
              items,
              total,
              paymentId: response.razorpay_payment_id,
              status: "paid",
              address: finalAddress
            })
          },
          { method: "post" }
        );
      },
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
        contact: user?.phoneNumber || "",
      },
      theme: {
        color: "#5D3FD3",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (items.length === 0 && !actionData?.success) {
    return (
      <div className={styles.container}>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <h2>Your cart is empty</h2>
          <Button onClick={() => navigate('/')} style={{ marginTop: 'var(--spacing-4)' }}>
            Return to Shop
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      <div className={styles.checkoutGrid}>
        <div className={styles.forms}>
          <Card>
            <h2>Shipping Address</h2>
            <div className={styles.addressList}>
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`${styles.addressCard} ${
                    selectedAddressIndex === index ? styles.selectedAddress : ""
                  }`}
                  onClick={() => {
                    setSelectedAddressIndex(index);
                    setIsAddingNew(false);
                  }}
                >
                  <div>{addr.street}</div>
                  <div>
                    {addr.city}, {addr.state} {addr.zip}
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={() => { setIsAddingNew(true); setSelectedAddressIndex(-1); }}>
                + Add New Address
              </Button>
            </div>

            {isAddingNew && (
              <div className={styles.newAddressForm}>
                <h3>New Address</h3>
                <Input
                  label="Street Address"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  required
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--spacing-4)",
                  }}
                >
                  <Input
                    label="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="State"
                    value={newAddress.state || ""}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                  />
                </div>
                <Input
                  label="ZIP Code"
                  value={newAddress.zip || ""}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  required
                />
              </div>
            )}
          </Card>
        </div>

        <Card className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.items}>
            {items.map((item, i) => (
              <div key={`${item.product.id}-${i}`} className={styles.item}>
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
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.product.name}</div>
                  <div className={styles.itemPrice}>
                    {item.quantity} x ${item.product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            style={{ marginTop: "var(--spacing-4)" }}
            onClick={handlePayment}
            loading={loading}
            disabled={items.length === 0}
          >
            Pay Now
          </Button>
          
          {actionData?.error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem', marginTop: 'var(--spacing-2)' }}>
              {actionData.error}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
