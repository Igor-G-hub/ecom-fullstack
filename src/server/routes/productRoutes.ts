import { Router } from 'express';
import productController from '../controllers/productController';

const router = Router();

// GET /api/products - Get all products with optional filters
router.get('/', productController.getAllProducts.bind(productController));

// POST /api/products - Create a new product
router.post('/', productController.createProduct.bind(productController));

// GET /api/products/:id/related - Get related products
router.get('/:id/related', productController.getRelatedProducts.bind(productController));

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProductById.bind(productController));

// PUT /api/products/:id - Update a product
router.put('/:id', productController.updateProduct.bind(productController));

// DELETE /api/products/:id - Delete a product
router.delete('/:id', productController.deleteProduct.bind(productController));

export default router;


