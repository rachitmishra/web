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
    const loadData = async () => {
      console.log("[Home] loadData started");
      
      // 5-second timeout to prevent permanent loading screen
      const timeout = new Promise((_, reject) => 
        setTimeout(() => {
          console.log("[Home] Data loading timed out (5s)");
          reject(new Error("Loading timeout"));
        }, 5000)
      );

      try {
        console.log("[Home] Starting Promise.race...");
        const [fetchedProducts, fetchedCategories, fetchedBestSellers, fetchedSettings] = await Promise.race([
          Promise.all([
            fetchProducts().then(res => { console.log("[Home] fetchProducts done"); return res; }),
            fetchCategories().then(res => { console.log("[Home] fetchCategories done"); return res; }),
            fetchBestSellers().then(res => { console.log("[Home] fetchBestSellers done"); return res; }),
            getStorefrontSettings().then(res => { console.log("[Home] getStorefrontSettings done"); return res; }),
          ]),
          timeout
        ]) as [Product[], Category[], Product[], StorefrontSettings];

        console.log("[Home] Promise.race resolved successfully", {
          products: fetchedProducts?.length,
          categories: fetchedCategories?.length,
          bestSellers: fetchedBestSellers?.length
        });

        if (fetchedProducts) setProducts(fetchedProducts);
        if (fetchedBestSellers) setBestSellers(fetchedBestSellers);
        if (fetchedSettings) setSettings(fetchedSettings);

        // Ensure "All" is always present if not already in Firestore
        const hasAll = (fetchedCategories || []).find((c) => c.id === "all");
        if (!hasAll) {
          console.log("[Home] Adding 'All' category manually");
          setCategories([{ id: "all", name: "All" }, ...(fetchedCategories || [])]);
        } else {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("[Home] Error in loadData:", error);
      } finally {
        console.log("[Home] Setting loading to false");
        setLoading(false);
      }
    };

    loadData();
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

  useEffect(() => {
    console.log("[Home] loading state changed to:", loading);
  }, [loading]);

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("[Home] Safety timeout triggered: forcing loading to false");
        setLoading(false);
      }
    }, 6000);
    return () => clearTimeout(safetyTimeout);
  }, [loading]);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ 
        padding: "var(--spacing-8)", 
        textAlign: "center", 
        background: "red", 
        color: "white", 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h1 style={{ color: "white" }}>DEBUG: HOME LOADING V2</h1>
        HOPOLO LOADING V2...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ position: 'fixed', top: 0, left: 0, padding: '10px', background: 'green', color: 'white', zIndex: 1000 }}>DEBUG: LOADED</div>
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
