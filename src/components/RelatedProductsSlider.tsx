"use client";

import ProductCard from "./ProductCard";
import styles from "./RelatedProductsSlider.module.scss";

interface Product {
  id: number;
  title: string;
  price: number | string;
  category: string;
  image: string;
}

interface RelatedProductsSliderProps {
  products: Product[];
}

export default function RelatedProductsSlider({
  products,
}: RelatedProductsSliderProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Related Products</h2>
      <div className={styles.products}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <ProductCard
              id={product.id}
              title={product.title}
              price={
                typeof product.price === "string"
                  ? Number(product.price)
                  : product.price
              }
              category={product.category}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
