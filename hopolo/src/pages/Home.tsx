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
  const [isGridChanging, setIsGridChanging] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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
      try {
        // Individual fetches so one failure doesn't block the rest
        const pProducts = fetchProducts().catch(e => { console.error("fetchProducts error:", e); return []; });
        const pCategories = fetchCategories().catch(e => { console.error("fetchCategories error:", e); return []; });
        const pBestSellers = fetchBestSellers().catch(e => { console.error("fetchBestSellers error:", e); return []; });
        const pSettings = getStorefrontSettings().catch(e => { console.error("getStorefrontSettings error:", e); return DEFAULT_SETTINGS; });

        const [fProducts, fCategories, fBestSellers, fSettings] = await Promise.all([
          pProducts, pCategories, pBestSellers, pSettings
        ]);

        if (!mounted) return;

        setProducts(fProducts || []);
        setBestSellers(fBestSellers || []);
        setSettings(fSettings || DEFAULT_SETTINGS);

        // Ensure "All" is always present
        const fetchedCats = fCategories || [];
        const hasAll = fetchedCats.find((c) => c.id === "all");
        if (!hasAll) {
          setCategories([{ id: "all", name: "All" }, ...fetchedCats]);
        } else {
          setCategories(fetchedCats);
        }
      } catch (error) {
        console.error("[Home] Error loading data:", error);
      } finally {
        if (mounted) {
          setIsInitialLoad(false);
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
        {bestSellers.length > 0 && <BestSellers products={bestSellers} />}

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

        {!isInitialLoad && filteredProducts.length === 0 && (
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
        
        {isInitialLoad && (
          <div style={{ textAlign: "center", padding: "var(--spacing-8)", opacity: 0.5 }}>
            Loading products...
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
