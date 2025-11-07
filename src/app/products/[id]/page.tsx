import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import RelatedProductsSlider from "@/components/RelatedProductsSlider";
import styles from "./page.module.scss";

// --- Types ----------------------------------------------------

type Product = {
  id: number;
  title: string;
  price: number | string;
  category: string;
  image: string;
  description: string;
  availability: boolean;
};

// --- Server Component ------------------------------------------------------------

async function fetchProduct(id: number): Promise<Product | null> {
  // Use internal Docker network URL if available, otherwise use public URL
  const API_BASE_URL =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function fetchRelatedProducts(
  id: number,
  limit: number = 4
): Promise<Product[]> {
  // Use internal Docker network URL if available, otherwise use public URL
  const API_BASE_URL =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/${id}/related?limit=${limit}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      return [];
    }

    const responseJson: { products: Product[] } = await response.json();

    return responseJson.products || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

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

  const product = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  // Fetch related products in parallel
  const relatedProducts = await fetchRelatedProducts(productId, 4);

  const price =
    typeof product.price === "string" ? Number(product.price) : product.price;
  const displayPrice = Number.isFinite(price) ? price : null;

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
              {displayPrice !== null && (
                <span className={styles.price}>${displayPrice.toFixed(2)}</span>
              )}
              <span
                className={`${styles.stockBadge} ${
                  product.availability ? styles.inStock : styles.outOfStock
                }`}
              >
                {product.availability ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className={styles.descriptionSection}>
              <h2 className={styles.descriptionLabel}>Description</h2>
              <p className={styles.description}>{product.description}</p>
            </div>

            <ProductActions productId={productId} product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <RelatedProductsSlider products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
