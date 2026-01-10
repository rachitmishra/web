import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import './App.css';

export const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
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