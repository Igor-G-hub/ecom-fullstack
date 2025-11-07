import { prisma } from "../../lib/prisma";
import { Product, ProductCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { getMockProducts } from "../mockData/products";

// TEMPORARY: Set to true to use mock data instead of database
const USE_MOCK_DATA = false;

export interface CreateProductDto {
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  price: number;
  availability: boolean;
}

export interface UpdateProductDto {
  title?: string;
  description?: string;
  image?: string;
  category?: ProductCategory;
  price?: number;
  availability?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc";
}

class ProductService {
  async getAllProducts(
    filters?: ProductFilters
  ): Promise<{ products: Product[]; total: number }> {
    if (USE_MOCK_DATA) {
      // TEMPORARY: Using mock data
      let products = getMockProducts();

      // Apply search filter
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter((p) =>
          p.title.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (filters?.category && filters.category.length > 0) {
        products = products.filter((p) =>
          filters.category!.includes(p.category)
        );
      }

      // Apply price filters
      if (filters?.minPrice !== undefined) {
        products = products.filter((p) => Number(p.price) >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        products = products.filter((p) => Number(p.price) <= filters.maxPrice!);
      }

      // Apply sorting
      if (filters?.sortBy === "price_asc") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (filters?.sortBy === "price_desc") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
      } else {
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }

      return {
        products,
        total: products.length,
      };
    }

    // Database query (commented out temporarily)
    const where: any = {};

    if (filters?.search) {
      where.title = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    if (filters?.category && filters.category.length > 0) {
      where.category = {
        in: filters.category,
      };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const orderBy: any = {};
    if (filters?.sortBy === "price_asc") {
      orderBy.price = "asc";
    } else if (filters?.sortBy === "price_desc") {
      orderBy.price = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return {
      products,
      total: products.length,
    };
  }

  async getProductById(id: number): Promise<Product | null> {
    if (USE_MOCK_DATA) {
      // TEMPORARY: Using mock data
      const products = getMockProducts();
      return products.find((p) => p.id === id) || null;
    }

    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    if (USE_MOCK_DATA) {
      const products = getMockProducts();
      const now = new Date();
      const newProduct: Product = {
        id: products.length + 1,
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        price: new Decimal(data.price),
        availability: data.availability,
        createdAt: now,
        updatedAt: now,
      } as Product;

      return newProduct;
    }

    return await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        price: data.price,
        availability: data.availability,
      },
    });
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    if (USE_MOCK_DATA) {
      const products = getMockProducts();
      const existingProduct = products.find((p) => p.id === id);

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      return {
        ...existingProduct,
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
        ...(data.category && { category: data.category }),
        ...(data.price !== undefined && { price: new Decimal(data.price) }),
        ...(data.availability !== undefined && {
          availability: data.availability,
        }),
        updatedAt: new Date(),
      };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    return await prisma.product.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.image && { image: data.image }),
        ...(data.category && { category: data.category }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.availability !== undefined && {
          availability: data.availability,
        }),
      },
    });
  }

  async deleteProduct(id: number): Promise<void> {
    if (USE_MOCK_DATA) {
      const products = getMockProducts();
      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new Error("Product not found");
      }

      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  async getRelatedProducts(id: number, limit: number = 4): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      const products = getMockProducts();
      const product = products.find((p) => p.id === id);

      if (!product) {
        throw new Error("Product not found");
      }

      return products
        .filter((p) => p.category === product.category && p.id !== id)
        .slice(0, limit)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { category: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: id },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new ProductService();
