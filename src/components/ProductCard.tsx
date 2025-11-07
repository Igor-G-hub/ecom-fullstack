'use client';

import Link from 'next/link';
import { Product } from '@prisma/client';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceValue = Number(product.price);
  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.title} className={styles.image} />
        {!product.availability && (
          <div className={styles.unavailable}>Out of Stock</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>
          {Number.isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : '—'}
        </p>
      </div>
    </Link>
  );
}


