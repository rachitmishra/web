import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/pages/Home.tsx"),
  route("product/:id", "../src/pages/ProductDetail.tsx"),
  route("cart", "../src/pages/Cart.tsx"),
  route("login", "../src/pages/Login.tsx"),
  route("checkout", "../src/pages/Checkout.tsx"),
  route("checkout/success/:orderId", "../src/pages/Success.tsx"),
  
  // Info Pages
  route("about", "../src/pages/Static/InfoPages.tsx", { id: "about" }),
  route("shipping", "../src/pages/Static/InfoPages.tsx", { id: "shipping" }),
  route("contact", "../src/pages/Static/InfoPages.tsx", { id: "contact" }),
  
  route("profile", "../src/pages/Profile.tsx"),
  route("maintenance", "../src/pages/Static/Maintenance.tsx"),
  
  // Admin Routes
  route("admin", "../src/pages/Admin/Orders.tsx", { id: "admin-home" }),
  route("admin/orders", "../src/pages/Admin/Orders.tsx", { id: "admin-orders" }),
  route("admin/orders/:id", "../src/pages/Admin/OrderDetail.tsx"),
  route("admin/email-logs", "../src/pages/Admin/EmailLogs.tsx"),
  route("admin/inventory", "../src/pages/Admin/Inventory.tsx"),
  route("admin/marketing", "../src/pages/Admin/Marketing.tsx"),
  route("admin/seed", "../src/pages/Admin/SeedData.tsx"),
  route("admin/analytics", "../src/pages/Admin/Analytics.tsx"),
  route("admin/invitations", "../src/pages/Admin/Invitations.tsx"),
  route("admin/storefront", "../src/pages/Admin/Storefront.tsx"),
] satisfies RouteConfig;