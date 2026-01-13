import React from "react";
import styles from "./CategoryTabs.module.css";
import type { Category } from "../../../services/productService";

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className={styles.tabs}>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`${styles.tab} ${
            activeCategoryId === category.id ? styles.activeTab : ""
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
