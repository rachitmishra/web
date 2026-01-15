import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../../services/productService';
import styles from './BestSellers.module.css';
import { useNavigate } from 'react-router-dom';

interface BestSellersProps {
  products: Product[];
}

const BestSellers: React.FC<BestSellersProps> = ({ products }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return null; // Or return <div className={styles.empty}>No best sellers yet.</div>
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Best Sellers</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('Add to cart', p)}
            onClick={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
