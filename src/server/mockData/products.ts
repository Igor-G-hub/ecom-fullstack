import { Product, ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Mock product data matching the Prisma Product model structure
// This is temporary - switch back to database queries by uncommenting prisma calls in productService.ts

export const MOCK_PRODUCTS: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Sneakers",
    description:
      "Comfortable and stylish canvas sneakers perfect for everyday wear. Features durable construction and cushioned insoles for all-day comfort.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    category: "Shoes" as ProductCategory,
    price: new Decimal(49.0),
    availability: true,
  },
  {
    title: "T‑Shirt",
    description:
      "Classic cotton t-shirt with a comfortable fit. Made from soft, breathable fabric ideal for casual wear. Available in multiple colors.",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    category: "Clothing" as ProductCategory,
    price: new Decimal(13.0),
    availability: true,
  },
  {
    title: "Headphones",
    description:
      "High-quality over-ear headphones with excellent sound quality and noise isolation. Perfect for music lovers and professionals.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    category: "Electronics" as ProductCategory,
    price: new Decimal(38.0),
    availability: true,
  },
  {
    title: "Smartphone",
    description:
      "Latest generation smartphone with advanced camera system, powerful processor, and long-lasting battery. Features a stunning display and premium build quality.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    category: "Electronics" as ProductCategory,
    price: new Decimal(699.0),
    availability: true,
  },
  {
    title: "Watch",
    description:
      "Elegant minimalist watch with a sleek black design. Features a leather strap and precision movement. Perfect for both casual and formal occasions.",
    image:
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=800&auto=format&fit=crop",
    category: "Accessories" as ProductCategory,
    price: new Decimal(149.0),
    availability: true,
  },
  {
    title: "Bag",
    description:
      "Stylish leather cross-body bag with multiple compartments. Crafted from premium materials with attention to detail. Perfect for daily essentials.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    category: "Accessories" as ProductCategory,
    price: new Decimal(89.0),
    availability: true,
  },
  {
    title: "Jeans",
    description:
      "Classic fit jeans made from high-quality denim. Comfortable and durable with a timeless design. Perfect for everyday wear.",
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800&auto=format&fit=crop",
    category: "Clothing" as ProductCategory,
    price: new Decimal(59.0),
    availability: true,
  },
  {
    title: "Laptop",
    description:
      "Powerful laptop with high-performance specifications. Features a crisp display, fast processor, and ample storage. Ideal for work, gaming, and creative projects.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    category: "Electronics" as ProductCategory,
    price: new Decimal(999.0),
    availability: true,
  },
];

// Helper function to convert mock data to Product-like objects with IDs
export function getMockProducts(): Product[] {
  const now = new Date();
  return MOCK_PRODUCTS.map((product, index) => ({
    id: index + 1,
    ...product,
    createdAt: now,
    updatedAt: now,
  }));
}

