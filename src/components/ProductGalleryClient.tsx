"use client";

import React, { useMemo, useState, useEffect } from "react";
import AddProductDialog from "@/components/AddProductDialog";
import ProductHeader from "@/components/ProductHeader";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import styles from "@/app/page.module.scss";

// --- Types ----------------------------------------------------

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

type SortKey = "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface ProductGalleryClientProps {
  initialProducts: Product[];
}

// --- Component ------------------------------------------------------------

export default function ProductGalleryClient({
  initialProducts,
}: ProductGalleryClientProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sync initial products when they change (from server)
  useEffect(() => {
    setAllProducts(initialProducts);
  }, [initialProducts]);

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

  // Refresh products when trigger changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${API_BASE_URL}/api/products`);

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

    if (refreshTrigger > 0) {
      fetchProducts();
    }
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
    <>
      <div className={styles.mainCard}>
        <ProductHeader onAddProduct={() => setIsAddProductOpen(true)} />

        <div className={styles.grid}>
          <ProductFilters
            query={query}
            onQueryChange={setQuery}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
            priceRange={priceRange}
            priceMin={priceMin}
            priceMax={priceMax}
            onPriceMinChange={handlePriceMinChange}
            onPriceMaxChange={handlePriceMaxChange}
            sort={sort}
            onSortChange={setSort}
          />

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
      <AddProductDialog
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={() => {
          setRefreshTrigger((prev) => prev + 1);
        }}
      />
    </>
  );
}
