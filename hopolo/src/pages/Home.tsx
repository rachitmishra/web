import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Hero from '../components/ui/Hero/Hero';
import CategoryTabs from '../components/ui/CategoryTabs/CategoryTabs';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import { fetchProducts, fetchCategories, type Product, type Category } from '../services/productService';
import { useSEO } from '../hooks/useSEO';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const seoTitle = activeCategoryId === 'all' 
    ? 'Hopolo Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | Hopolo Boutique`;

  useSEO({
    title: seoTitle,
    description: 'Discover unique products curated just for you. Minimalist design, playful details.',
    ogType: 'website'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setProducts(fetchedProducts);

        // Ensure "All" is always present if not already in Firestore
        const hasAll = fetchedCategories.find((c) => c.id === "all");
        if (!hasAll) {
          setCategories([{ id: "all", name: "All" }, ...fetchedCategories]);
        } else {
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === "all") return products;
    return products.filter((p) => p.category === activeCategoryId);
  }, [products, activeCategoryId]);

  if (loading) {
    return (
      <div style={{ padding: "var(--spacing-8)", textAlign: "center" }}>
        Loading boutique experience...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-8)",
      }}
    >
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "var(--spacing-6)",
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p) => console.log("Add to cart:", p)}
              onClick={(id) => navigate(`/product/${id}`)}
            />
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

      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "var(--spacing-12)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "var(--spacing-8)" }}>
          Loved by Customers
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--spacing-6)",
          }}
        >
          {[
            {
              name: "Sarah L.",
              emoji: "😊",
              text: "Amazing quality and fast delivery. Highly recommended!",
            },
            {
              name: "Marcus T.",
              emoji: "😊",
              text: "Minimalist design that fits perfectly in my home.",
            },
            {
              name: "Elena G.",
              emoji: "😊",
              text: "The emoji-based review system is so fun and easy!",
            },
          ].map((rev, i) => (
            <div
              key={i}
              style={{
                padding: "var(--spacing-6)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{ fontWeight: "bold", marginBottom: "var(--spacing-2)" }}
              >
                {rev.name} {rev.emoji}
              </div>
              <p
                style={{
                  margin: 0,
                  color: "var(--color-text-muted)",
                  lineHeight: "1.6",
                }}
              >
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
