import React from 'react';
import styles from './QuantitySelector.module.css';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onChange, max }) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (max === undefined || quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={handleDecrement}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className={styles.value}>{quantity}</span>
      <button
        className={styles.button}
        onClick={handleIncrement}
        disabled={max !== undefined && quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
