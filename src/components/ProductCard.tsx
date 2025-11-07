"use client";

import Link from "next/link";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

export default function ProductCard({
  id,
  title,
  price,
  category,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className={styles.card}>
      <div className={styles.thumb}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{category}</div>
        <div className={styles.price}>${Number(price).toFixed(2)}</div>
      </div>
    </Link>
  );
}

