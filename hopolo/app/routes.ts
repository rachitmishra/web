import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("product/:id", "pages/ProductDetail.tsx"),
  route("cart", "pages/Cart.tsx"),
  route("login", "pages/Login.tsx"),
  route("checkout", "pages/Checkout.tsx"),
  route("checkout/success/:orderId", "pages/Success.tsx"),
  route("about", "pages/Static/InfoPages.tsx"),
  route("shipping", "pages/Static/InfoPages.tsx"),
  route("contact", "pages/Static/InfoPages.tsx"),
  route("profile", "pages/Profile.tsx"),
  
  // Admin Routes
  route("admin", "pages/Admin/Orders.tsx"),
  route("admin/orders", "pages/Admin/Orders.tsx"),
  route("admin/orders/:id", "pages/Admin/OrderDetail.tsx"),
  route("admin/email-logs", "pages/Admin/EmailLogs.tsx"),
  route("admin/inventory", "pages/Admin/Inventory.tsx"),
  route("admin/marketing", "pages/Admin/Marketing.tsx"),
  route("admin/seed", "pages/Admin/SeedData.tsx"),
  route("admin/analytics", "pages/Admin/Analytics.tsx"),
  route("admin/invitations", "pages/Admin/Invitations.tsx"),
] satisfies RouteConfig;
