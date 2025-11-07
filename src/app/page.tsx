import ProductGalleryClient from "@/components/ProductGalleryClient";
import styles from "./page.module.scss";

// --- Types ----------------------------------------------------

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

async function fetchProducts(): Promise<Product[]> {
  // Use internal Docker network URL if available, otherwise use public URL
  const API_BASE_URL =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    // Map API products to component format
    const mappedProducts: Product[] = data.products.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
      category: p.category,
      image: p.image,
      description: p.description,
    }));

    return mappedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function HomePage() {
  const initialProducts = await fetchProducts();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ProductGalleryClient initialProducts={initialProducts} />
      </div>
    </div>
  );
}
