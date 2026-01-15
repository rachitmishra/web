import React from "react";
import Card from "../Card/Card";
import Button from "../Button/Button";
import styles from "./ProductCard.module.css";
import type { Product } from "../../../services/productService";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
}) => {
  return (
    <Card
      className={styles.productCard}
      onClick={() => onClick?.(product.id)}
      data-testid={`product-card-${product.id}`}
    >
      <div className={styles.imageContainer}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div
            className={styles.image}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eee",
            }}
          >
            No Image
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRating}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {product.rating !== undefined && (
            <span className={styles.rating}>⭐ {product.rating}</span>
          )}
        </div>
      </div>

      <Button
        className={styles.addToCart}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(product);
        }}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
