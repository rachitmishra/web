import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Orders from './pages/Admin/Orders';
import OrderDetail from './pages/Admin/OrderDetail';
import EmailLogs from './pages/Admin/EmailLogs';
import ProtectedRoute from './components/ui/Auth/ProtectedRoute';
import AdminRoute from './components/ui/Auth/AdminRoute';

// ...
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