"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "@/store/api/productsApi";
import styles from "./page.module.scss";

interface ProductDetailProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const productId = Number(params.id);
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(productId, {
    skip: Number.isNaN(productId),
  });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const price = useMemo(() => {
    if (!product) return null;
    const value =
      typeof product.price === "string" ? Number(product.price) : product.price;
    return Number.isFinite(value) ? value : null;
  }, [product]);

  const handleEdit = () => {
    router.push(`/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!product || Number.isNaN(productId)) return;

    try {
      setDeleteError(null);
      await deleteProduct(productId).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Failed to delete product", err);
      setDeleteError("Failed to delete product. Please try again.");
    }
  };

  if (Number.isNaN(productId)) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Invalid product identifier</div>
        <Link href="/" className={styles.backLink}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error && "status" in error
            ? `Unable to load product (${error.status})`
            : "Product not found"}
        </div>
        <Link href="/" className={styles.backLink}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <span>{product.category}</span>
        </nav>

        <div className={styles.productCard}>
          <div className={styles.imageSection}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.image}
            />
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.priceRow}>
              {price !== null && (
                <span className={styles.price}>${price.toFixed(2)}</span>
              )}
              <span className={styles.stockBadge}>
                {product.availability ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionLabel}>Description</h2>
              <p className={styles.description}>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleEdit}
              >
                Update Product
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
            {deleteError && (
              <div className={styles.deleteError}>{deleteError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
