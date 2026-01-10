import React, { useEffect, useState, useMemo } from 'react';
import Hero from '../components/ui/Hero/Hero';
import CategoryTabs from '../components/ui/CategoryTabs/CategoryTabs';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import { fetchProducts, fetchCategories, Product, Category } from '../services/productService';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        setProducts(fetchedProducts);
        
        // Ensure "All" is always present if not already in Firestore
        const hasAll = fetchedCategories.find(c => c.id === 'all');
        if (!hasAll) {
          setCategories([{ id: 'all', name: 'All' }, ...fetchedCategories]);
        } else {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === 'all') return products;
    return products.filter(p => p.category === activeCategoryId);
  }, [products, activeCategoryId]);

  if (loading) {
    return <div style={{ padding: 'var(--spacing-8)', textAlign: 'center' }}>Loading boutique experience...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
      <Hero 
        title="Hopolo Boutique" 
        subtitle="Discover unique products curated just for you. Minimalist design, playful details."
      />

      <section>
        <CategoryTabs 
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-6)' 
        }}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={(p) => console.log('Add to cart:', p)}
              onClick={(id) => console.log('Navigate to:', id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
            No products found in this category.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
