"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AddProductDialog from "@/components/AddProductDialog";
import { useAuth } from "@/contexts/AuthContext";
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

type ApiProduct = {
  id: number;
  title: string;
  price: number | string;
  category: string;
  image: string;
  description: string;
};

const CATEGORIES = [
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// --- Component ------------------------------------------------------------

export default function ProductGalleryPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { logout } = useAuth();

  // Calculate available price range from all products
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 1000 };
    const prices = allProducts.map((p) => Number(p.price));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [allProducts]);

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // Initialize price range when products are first loaded
  useEffect(() => {
    if (allProducts.length > 0 && priceMin === 0 && priceMax === 1000) {
      setPriceMin(priceRange.min);
      setPriceMax(priceRange.max);
    }
  }, [allProducts, priceRange, priceMin, priceMax]);

  // Fetch all products from API (no filtering on server)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();

        // Map API products to component format
        const mappedProducts: Product[] = data.products.map(
          (p: ApiProduct) => ({
            id: p.id,
            title: p.title,
            price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
            category: p.category,
            image: p.image,
            description: p.description,
          })
        );

        setAllProducts(mappedProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshTrigger]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((p) => selectedCategories.has(p.category));
    }

    // Apply price range filter
    filtered = filtered.filter(
      (p) => Number(p.price) >= priceMin && Number(p.price) <= priceMax
    );

    // Apply sorting
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [allProducts, query, selectedCategories, priceMin, priceMax, sort]);

  function toggleCategory(cat: string) {
    const next = new Set(selectedCategories);
    next.has(cat) ? next.delete(cat) : next.add(cat);
    setSelectedCategories(next);
  }

  const handlePriceMinChange = (value: number) => {
    setPriceMin(Math.min(value, priceMax - 1));
  };

  const handlePriceMaxChange = (value: number) => {
    setPriceMax(Math.max(value, priceMin + 1));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.headerActions}>
              <button className={styles.logoutBtn} onClick={logout}>
                Logout
              </button>
              <button
                className={styles.addBtn}
                onClick={() => setIsAddProductOpen(true)}
              >
                <span className={styles.plusIcon}>+</span>
                Add Product
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* Search */}
              <div className={styles.field}>
                <label>Search</label>
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>🔎</span>
                  <input
                    className={`${styles.searchInput}`}
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
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
                        onChange={() => toggleCategory(cat)}
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
                      onChange={(e) =>
                        handlePriceMinChange(Number(e.target.value))
                      }
                    />
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={priceMax}
                      onChange={(e) =>
                        handlePriceMaxChange(Number(e.target.value))
                      }
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
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="price-asc">Price (Low → High)</option>
                  <option value="price-desc">Price (High → Low)</option>
                  <option value="name-asc">Name (A → Z)</option>
                  <option value="name-desc">Name (Z → A)</option>
                </select>
              </div>
            </aside>

            {/* Product Grid */}
            <main>
              <div className={styles.products}>
                {loading && (
                  <div className={styles.empty}>Loading products...</div>
                )}
                {error && <div className={styles.empty}>Error: {error}</div>}
                {!loading && !error && filteredProducts.length === 0 && (
                  <div className={styles.empty}>
                    No products match your filters.
                  </div>
                )}
                {!loading &&
                  !error &&
                  filteredProducts.map((p) => (
                    <Link
                      href={`/products/${p.id}`}
                      key={p.id}
                      className={styles.card}
                    >
                      <div className={styles.thumb}>
                        <img src={p.image} alt={p.title} />
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.title}>{p.title}</div>
                        <div className={styles.meta}>{p.category}</div>
                        <div className={styles.price}>
                          ${Number(p.price).toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </main>
          </div>
        </div>
      </div>
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </div>
  );
}
