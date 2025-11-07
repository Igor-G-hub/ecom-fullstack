"use client";

import { ProductCategory } from "@prisma/client";
import styles from "./ProductFilters.module.scss";

const CATEGORIES: ProductCategory[] = [
  "Clothing",
  "Shoes",
  "Accessories",
  "Electronics",
  "Books",
  "Home",
  "Sports",
  "Toys",
  "Beauty",
  "Other",
];

type SortKey = "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface ProductFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedCategories: Set<string>;
  onCategoryToggle: (category: string) => void;
  priceRange: { min: number; max: number };
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export default function ProductFilters({
  query,
  onQueryChange,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  sort,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <aside className={styles.sidebar}>
      {/* Search */}
      <div className={styles.field}>
        <label>Search</label>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔎</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className={styles.field}>
        <label>Category</label>
        <div className={styles.checkboxList}>
          {CATEGORIES.map((cat) => (
            <label className={styles.checkbox} key={cat}>
              <input
                type="checkbox"
                checked={selectedCategories.has(cat)}
                onChange={() => onCategoryToggle(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className={styles.field}>
        <label>Price Range</label>
        <div className={styles.rangeWrap}>
          <div className={styles.rangeLabels}>
            <span>${priceRange.min}</span>
            <span>${priceRange.max}</span>
          </div>
          <div className={styles.rangePair}>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={priceMin}
              onChange={(e) => onPriceMinChange(Number(e.target.value))}
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={priceMax}
              onChange={(e) => onPriceMaxChange(Number(e.target.value))}
            />
          </div>
          <div className={styles.selectedPrice}>
            Selected: ${priceMin} - ${priceMax}
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className={styles.field}>
        <label>Sort by</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
        >
          <option value="price-asc">Price (Low → High)</option>
          <option value="price-desc">Price (High → Low)</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
        </select>
      </div>
    </aside>
  );
}

