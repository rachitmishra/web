import React, { useEffect, useState } from 'react';
import { fetchProducts, type Product } from '../../services/productService';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import ProductForm from './ProductForm';
import styles from './Inventory.module.css';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div>Loading inventory...</div>;

  if (isAdding) {
    return (
      <ProductForm 
        onCancel={() => setIsAdding(false)} 
        onSave={(data) => {
          console.log('Save:', data);
          setIsAdding(false);
        }} 
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Inventory</h1>
        <Button onClick={() => setIsAdding(true)}>Add Product</Button>
      </div>

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Stock</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.td}>{product.name}</td>
                <td className={styles.td}>{product.category}</td>
                <td className={styles.td}>${product.price}</td>
                <td className={styles.td}>
                  {product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0}
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <Button variant="outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Edit</Button>
                    <Button variant="outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
            No products found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Inventory;
