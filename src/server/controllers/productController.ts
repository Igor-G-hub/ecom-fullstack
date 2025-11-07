import { Request, Response, NextFunction } from "express";
import productService, {
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from "../services/productService";

class ProductController {
  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: ProductFilters = {
        search: req.query.search as string | undefined,
        category: req.query.category
          ? ((Array.isArray(req.query.category)
              ? (req.query.category as string[])
              : [req.query.category as string]) as any)
          : undefined,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        sortBy: req.query.sortBy as "price_asc" | "price_desc" | undefined,
      };

      const result = await productService.getAllProducts(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const productId = Number.parseInt(id, 10);
      if (Number.isNaN(productId)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }

      const product = await productService.getProductById(productId);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: CreateProductDto = req.body;

      // Validate required fields
      if (
        !data.title ||
        !data.description ||
        !data.image ||
        !data.category ||
        data.price === undefined
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const product = await productService.createProduct(data);
      res.status(201).json(product);
    } catch (error: any) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateProductDto = req.body;
      const productId = Number.parseInt(id, 10);
      if (Number.isNaN(productId)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }

      const product = await productService.updateProduct(productId, data);
      res.json(product);
    } catch (error: any) {
      if (error.message === "Product not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const productId = Number.parseInt(id, 10);
      if (Number.isNaN(productId)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }

      await productService.deleteProduct(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      if (error.message === "Product not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  async getRelatedProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const productId = Number.parseInt(id, 10);
      if (Number.isNaN(productId)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
      }

      const products = await productService.getRelatedProducts(
        productId,
        limit
      );
      res.json({ products });
    } catch (error: any) {
      if (error.message === "Product not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new ProductController();
