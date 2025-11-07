"use client";

import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.scss";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function ProductGrid({
  products,
  loading,
  error,
}: ProductGridProps) {
  return (
    <main className={styles.mainContent}>
      <div className={styles.products}>
        {loading && (
          <div className={styles.empty}>Loading products...</div>
        )}
        {error && <div className={styles.empty}>Error: {error}</div>}
        {!loading && !error && products.length === 0 && (
          <div className={styles.empty}>No products match your filters.</div>
        )}
        {!loading &&
          !error &&
          products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              price={p.price}
              category={p.category}
              image={p.image}
            />
          ))}
      </div>
    </main>
  );
}

