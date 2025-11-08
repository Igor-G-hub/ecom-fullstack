import { Suspense } from "react";
import Link from "next/link";
import ProductDetailContent from "@/components/ProductDetailContent";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import styles from "./page.module.scss";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.error}>Invalid product identifier</div>
          <Link href="/" className={styles.backLink}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetailContent productId={productId} />
        </Suspense>
      </div>
    </div>
  );
}
