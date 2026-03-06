import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CinematicHero from '../components/ui/Hero/CinematicHero';
import CategoryTabs from '../components/ui/CategoryTabs/CategoryTabs';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import BestSellers from '../components/ui/BestSellers/BestSellers';
import { fetchProducts, fetchCategories, fetchBestSellers, type Product, type Category } from '../services/productService';
import { getStorefrontSettings, type StorefrontSettings, DEFAULT_SETTINGS } from '../services/storefrontService';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StorefrontSettings>(DEFAULT_SETTINGS);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isGridChanging, setIsGridChanging] = useState(false);
  const navigate = useNavigate();
  const productSectionRef = useRef<HTMLElement>(null);

  const seoTitle = activeCategoryId === 'all' 
    ? settings.heroTitle || 'Hopolo Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | ${settings.heroTitle || 'Hopolo Boutique'}`;

  useSEO({
    title: seoTitle,
    description: settings.heroSubtitle || 'Discover unique products curated just for you. Minimalist design, playful details.',
    ogType: 'website'
  });

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      // Safety timer: force loading to false after 8 seconds no matter what
      const safetyTimer = setTimeout(() => {
        if (mounted) {
          setLoading(false);
        }
      }, 8000);

      try {
        const [fetchedProducts, fetchedCategories, fetchedBestSellers, fetchedSettings] = await Promise.all([
          fetchProducts().catch(e => { console.error("fetchProducts error:", e); return []; }),
          fetchCategories().catch(e => { console.error("fetchCategories error:", e); return []; }),
          fetchBestSellers().catch(e => { console.error("fetchBestSellers error:", e); return []; }),
          getStorefrontSettings().catch(e => { console.error("getStorefrontSettings error:", e); return DEFAULT_SETTINGS; }),
        ]);

        if (!mounted) return;

        setProducts(fetchedProducts);
        setBestSellers(fetchedBestSellers);
        setSettings(fetchedSettings);

        // Ensure "All" is always present
        const hasAll = fetchedCategories.find((c) => c.id === "all");
        if (!hasAll) {
          setCategories([{ id: "all", name: "All" }, ...fetchedCategories]);
        } else {
          setCategories(fetchedCategories);
        }
        
      } catch (error) {
        console.error("[Home] Error in loadData block:", error);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };

    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleCategoryChange = (id: string) => {
    if (id === activeCategoryId) return;
    
    setIsGridChanging(true);
    setTimeout(() => {
      setActiveCategoryId(id);
      setIsGridChanging(false);
    }, 300);
  };

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === "all") return products;
    return products.filter((p) => p.category === activeCategoryId);
  }, [products, activeCategoryId]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ padding: "var(--spacing-8)", textAlign: "center" }}>
        Loading boutique experience...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CinematicHero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        backgroundImage={settings.heroImage}
        ctaText={settings.heroCtaText}
        onCtaClick={scrollToProducts}
      />

      <section ref={productSectionRef} className={styles.productSection}>
        <BestSellers products={bestSellers} />

        <CategoryTabs
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleCategoryChange}
        />

        <div className={`${styles.grid} ${isGridChanging ? styles.gridChanging : ''}`}>
          {filteredProducts.map((product, index) => (
            <div key={product.id} className={styles.productCardEntry} style={{ animationDelay: `${index * 0.05}s` }}>
              <ProductCard
                product={product}
                onAddToCart={(p) => console.log("Add to cart:", p)}
                onClick={(id) => navigate(`/product/${id}`)}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--spacing-8)",
              color: "var(--color-text-muted)",
            }}
          >
            No products found in this category.
          </div>
        )}
      </section>

      <section className={styles.reviewSection}>
        <h2 className={styles.reviewSectionTitle}>
          Loved by Customers
        </h2>
        <div className={styles.reviewGrid}>
          {settings.reviews.map((rev, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.reviewerName}>
                {rev.name} {rev.emoji}
              </div>
              <p className={styles.reviewText}>
                "{rev.text}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
