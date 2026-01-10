import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import QuantitySelector from '../components/ui/QuantitySelector/QuantitySelector';
import styles from './ProductDetail.module.css';
import { fetchProducts, Product } from '../services/productService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      // For now, we fetch all and find the one. 
      // In a real app, we'd have fetchProductById.
      try {
        const products = await fetchProducts();
        const found = products.find(p => p.id === id);
        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>Product not found.</div>;

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
        &larr; Back
      </Button>

      <div className={styles.productInfo}>
        <div className={styles.gallery}>
          {product.image ? (
            <img src={product.image} alt={product.name} className={styles.mainImage} />
          ) : (
            <div className={styles.mainImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
              No Image
            </div>
          )}
        </div>

        <div className={styles.details}>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          {product.rating && <div className={styles.rating}>⭐ {product.rating} / 5.0</div>}
          
          <p className={styles.description}>
            This is a beautiful {product.name}. Minimalist design with playful accents, perfect for your collection. High quality materials and crafted with care.
          </p>

          <div className={styles.actions}>
            <div className={styles.addToCartRow}>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
              <Button 
                className={styles.addToCartButton}
                onClick={() => console.log('Add to cart:', product, quantity)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer Reviews</h2>
        <div style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first to review!</div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Related Products</h2>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading related products...</div>
      </section>
    </div>
  );
};

export default ProductDetail;