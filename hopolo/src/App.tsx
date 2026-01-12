import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import InfoPages from './pages/Static/InfoPages';
import Orders from './pages/Admin/Orders';
import OrderDetail from './pages/Admin/OrderDetail';
import EmailLogs from './pages/Admin/EmailLogs';
import Inventory from './pages/Admin/Inventory';
import ProtectedRoute from './components/ui/Auth/ProtectedRoute';
import AdminRoute from './components/ui/Auth/AdminRoute';
import './App.css';

export const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success/:orderId" element={<Success />} />
      <Route path="/about" element={<InfoPages />} />
      <Route path="/shipping" element={<InfoPages />} />
      <Route path="/contact" element={<InfoPages />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders/:id" 
        element={
          <AdminRoute>
            <OrderDetail />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/email-logs" 
        element={
          <AdminRoute>
            <EmailLogs />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/inventory" 
        element={
          <AdminRoute>
            <Inventory />
          </AdminRoute>
        } 
      />
    </Routes>
  </MainLayout>
);

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
