import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import QuantitySelector from '../components/ui/QuantitySelector/QuantitySelector';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import styles from './ProductDetail.module.css';
import { fetchProducts, Product } from '../services/productService';
import { addToCart } from '../services/cartService';
import { fetchReviews, Review, addReview } from '../services/reviewService';
import { auth } from '../lib/firebase';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Review Form State
  const [newRating, setNewRating] = useState<number>(3);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 3: return '😊';
      case 2: return '😐';
      case 1: return '😞';
      default: return '❓';
    }
  };

  const loadProductAndReviews = async () => {
    if (!id) return;
    try {
      const [products, reviewsData] = await Promise.all([
        fetchProducts(),
        fetchReviews(id)
      ]);
      
      const found = products.find(p => p.id === id);
      setProduct(found || null);
      setReviews(reviewsData);
      
      if (found) {
        const related = products.filter(p => p.category === found.category && p.id !== id).slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductAndReviews();
    setQuantity(1);
  }, [id]);

  const handleAddToCart = async (p: Product = product!, q: number = quantity) => {
    if (!p) return;
    setAdding(true);
    try {
      await addToCart(p, q);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !id) return;
    
    setSubmittingReview(true);
    try {
      await addReview({
        productId: id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Friend',
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setNewRating(3);
      await loadProductAndReviews();
    } catch (err) {
      console.error('Failed to add review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

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