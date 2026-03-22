import React, { useState, useMemo, useRef } from "react";
import { useNavigate, useLoaderData, useSubmit, useActionData } from "react-router-dom";
import CinematicHero from '../components/ui/Hero/CinematicHero';
import CategoryTabs from '../components/ui/CategoryTabs/CategoryTabs';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import BestSellers from '../components/ui/BestSellers/BestSellers';
import { type Product, type Category } from '../services/productService';
import { fetchProducts, fetchCategories, fetchBestSellers } from '../services/productService.server';
import { type StorefrontSettings, DEFAULT_SETTINGS } from '../services/storefrontService';
import { getStorefrontSettings } from '../services/storefrontService.server';
import { addToCart } from '../services/cartService.server';
import { getSessionIdFromRequest } from '../lib/session';
import { useSEO } from '../hooks/useSEO';
import styles from './Home.module.css';

export async function loader() {
  try {
    const [fProducts, fCategories, fBestSellers, fSettings] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchBestSellers(),
      getStorefrontSettings()
    ]);

    const fetchedCats = fCategories || [];
    const categories = fetchedCats.find((c) => c.id === "all") 
      ? fetchedCats 
      : [{ id: "all", name: "All" }, ...fetchedCats];

    return {
      products: fProducts || [],
      categories,
      bestSellers: fBestSellers || [],
      settings: fSettings || DEFAULT_SETTINGS
    };
  } catch (error) {
    console.error("[Home Loader] Error loading data:", error);
    return {
      products: [],
      categories: [{ id: "all", name: "All" }],
      bestSellers: [],
      settings: DEFAULT_SETTINGS
    };
  }
}

export async function action({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-to-cart") {
    const productJson = formData.get("product") as string;
    if (!productJson) {
      return { success: false, error: "Product data missing" };
    }
    try {
      const product = JSON.parse(productJson);
      if (!product || !product.id) {
        throw new Error("Invalid product data");
      }
      await addToCart(sessionId, product, 1);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return null;
}

const Home: React.FC = () => {
  const { products, categories, bestSellers, settings } = useLoaderData() as {
    products: Product[];
    categories: Category[];
    bestSellers: Product[];
    settings: StorefrontSettings;
  };

  const actionData = useActionData() as { success?: boolean; error?: string };
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [isGridChanging, setIsGridChanging] = useState(false);
  
  const navigate = useNavigate();
  const submit = useSubmit();
  const productSectionRef = useRef<HTMLElement>(null);

  const seoTitle = activeCategoryId === 'all' 
    ? settings.heroTitle || 'Hopolo Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | ${settings.heroTitle || 'Hopolo Boutique'}`;

  useSEO({
    title: seoTitle,
    description: settings.heroSubtitle || 'Discover unique products curated just for you. Minimalist design, playful details.',
    ogType: 'website'
  });

  const handleCategoryChange = (id: string) => {
    if (id === activeCategoryId) return;
    
    setIsGridChanging(true);
    setTimeout(() => {
      setActiveCategoryId(id);
      setIsGridChanging(false);
    }, 300);
  };

  const handleAddToCart = (product: Product) => {
    submit(
      { intent: "add-to-cart", product: JSON.stringify(product) },
      { method: "post" }
    );
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
        {actionData?.error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              color: 'var(--color-danger)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '2rem',
              textAlign: 'center',
              border: '1px solid var(--color-danger)'
            }}
          >
            {actionData.error}
          </div>
        )}
        {bestSellers.length > 0 && (
          <BestSellers 
            products={bestSellers} 
            onAddToCart={handleAddToCart}
          />
        )}

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
                onAddToCart={handleAddToCart}
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
          {(settings.reviews || []).map((rev, i) => (
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
