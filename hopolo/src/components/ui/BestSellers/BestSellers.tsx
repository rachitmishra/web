import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../../../services/productService';
import styles from './BestSellers.module.css';
import { useNavigate } from 'react-router-dom';

interface BestSellersProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({ products, onAddToCart }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Best Sellers</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onClick={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
