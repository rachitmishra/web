import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData, useSubmit, useActionData } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import QuantitySelector from '../components/ui/QuantitySelector/QuantitySelector';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import styles from './ProductDetail.module.css';
import { type Product } from '../services/productService';
import { fetchProductById, fetchProducts } from '../services/productService.server';
import { type Review } from '../services/reviewService';
import { fetchReviews, addReview } from '../services/reviewService.server';
import { addToCart } from '../services/cartService.server';
import { auth } from '../lib/firebase';
import { getAuthenticatedUser } from '../lib/auth.server';
import { getSessionIdFromRequest } from '../lib/session';
import { useSEO } from '../hooks/useSEO';

export async function loader({ params }: { params: any }) {
  const { id } = params;
  if (!id) throw new Response("Product ID required", { status: 400 });

  try {
    const [product, reviews, allProducts] = await Promise.all([
      fetchProductById(id),
      fetchReviews(id),
      fetchProducts()
    ]);

    if (!product) throw new Response("Product not found", { status: 404 });

    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== id)
      .slice(0, 4);

    return { product, reviews, relatedProducts };
  } catch (error) {
    console.error("[ProductDetail Loader] Error:", error);
    throw error;
  }
}

export async function action({ request, params }: { request: Request, params: any }) {
  const { id: productId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-review") {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Response("Unauthorized", { status: 401 });
    
    const rating = parseInt(formData.get("rating") as string, 10);
    const comment = formData.get("comment") as string;
    const userName = formData.get("userName") as string;

    await addReview({
      productId,
      userId: user.uid,
      userName: userName || 'Friend',
      rating,
      comment
    });
    return { success: true };
  }

  if (intent === "add-to-cart") {
    const sessionId = getSessionIdFromRequest(request);
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const productJson = formData.get("product") as string;
    
    try {
      const product = JSON.parse(productJson);
      await addToCart(sessionId, product, quantity, { size, color });
      return { success: true, cartUpdated: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}

const ProductDetail: React.FC = () => {
  const { product, reviews, relatedProducts } = useLoaderData() as {
    product: Product;
    reviews: Review[];
    relatedProducts: Product[];
  };
  const actionData = useActionData() as { success?: boolean; cartUpdated?: boolean; error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  // Review Form State
  const [newRating, setNewRating] = useState<number>(3);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useSEO({
    title: product ? product.name : 'Product Details',
    description: product?.description,
    image: product?.image,
    ogType: 'product'
  });

  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 3: return '😊';
      case 2: return '😐';
      case 1: return '😞';
      default: return '❓';
    }
  };

  useEffect(() => {
    if (actionData?.success) {
      setSubmittingReview(false);
      setAdding(false);
      if (!actionData.cartUpdated) {
        setNewComment('');
        setNewRating(3);
      }
    }
  }, [actionData]);

  const handleAddToCart = (p: Product = product!, q: number = quantity) => {
    if (!p) return;
    
    if (p.sizes && p.sizes.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (p.colors && p.colors.length > 0 && !selectedColor) {
      alert('Please select a color.');
      return;
    }

    setAdding(true);
    submit(
      { 
        intent: "add-to-cart", 
        product: JSON.stringify(p), 
        quantity: q.toString(),
        size: selectedSize || "",
        color: selectedColor || ""
      },
      { method: "post" }
    );
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setSubmittingReview(true);
    submit(
      { 
        intent: "add-review", 
        rating: newRating.toString(), 
        comment: newComment,
        userName: auth.currentUser.displayName || ''
      },
      { method: "post" }
    );
  };

  return (
    <div className={styles.container}>
      {actionData?.error && (
        <div 
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            color: 'var(--color-danger)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid var(--color-danger)'
          }}
        >
          {actionData.error}
        </div>
      )}

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
          <div className={styles.price}>
            ${product.price.toFixed(2)}
            {product.priceDisclaimer && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>{product.priceDisclaimer}</span>}
          </div>
          {product.rating && <div className={styles.rating}>⭐ {product.rating} / 5.0</div>}
          
          {product.deliveryTime && (
            <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500 }}>
              Estimated Delivery: {product.deliveryTime}
            </div>
          )}

          <p className={styles.description}>
            {product.description || `This is a beautiful ${product.name}. Minimalist design with playful accents, perfect for your collection. High quality materials and crafted with care.`}
          </p>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className={styles.infoSection}>
              <strong>Specifications</strong>
              <div className={styles.infoGrid}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <span className={styles.infoKey}>{key}</span>
                    <span className={styles.infoValue}>{value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {product.artDetails && Object.keys(product.artDetails).length > 0 && (
            <div className={styles.infoSection}>
              <strong>Art Details</strong>
              <div className={styles.infoGrid}>
                {Object.entries(product.artDetails).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <span className={styles.infoKey}>{key}</span>
                    <span className={styles.infoValue}>{value}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong>Size</strong>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`${styles.ratingBtn} ${selectedSize === size ? styles.activeRating : ''}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ minWidth: '40px', textAlign: 'center' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong>Color</strong>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`${styles.ratingBtn} ${selectedColor === color ? styles.activeRating : ''}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ padding: '8px 16px' }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <div className={styles.addToCartRow}>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
              <Button 
                className={styles.addToCartButton}
                onClick={() => handleAddToCart()}
                loading={adding}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer Reviews</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} style={{ padding: 'var(--spacing-4)', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {review.userName} {getRatingEmoji(review.rating)}
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{review.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first to review!</p>
          )}
        </div>

        {auth.currentUser ? (
          <form className={styles.addReviewForm} onSubmit={handleAddReview}>
            <h3>Write a Review</h3>
            <div className={styles.emojiSelector}>
              {[3, 2, 1].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.ratingBtn} ${newRating === r ? styles.activeRating : ''}`}
                  onClick={() => setNewRating(r)}
                >
                  {getRatingEmoji(r)}
                </button>
              ))}
            </div>
            <textarea
              className={styles.reviewComment}
              placeholder="Share your thoughts about this product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <Button type="submit" loading={submittingReview} style={{ width: 'fit-content' }}>
              Submit Review
            </Button>
          </form>
        ) : (
          <p style={{ marginTop: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
            Please <Button variant="link" onClick={() => navigate('/login')} style={{ padding: 0, height: 'auto' }}>sign in</Button> to leave a review.
          </p>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Related Products</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: 'var(--spacing-6)' 
          }}>
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onClick={(id) => navigate(`/product/${id}`)}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
