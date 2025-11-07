'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/store/api/productsApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProductCategory } from '@prisma/client';
import styles from './page.module.scss';

const CATEGORIES: ProductCategory[] = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Books',
  'Home',
  'Sports',
  'Toys',
  'Beauty',
  'Other',
];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  category: Yup.string().oneOf(CATEGORIES).required('Category is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  availability: Yup.boolean().required('Availability is required'),
});

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const productId = Number(params.id);
  const router = useRouter();
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, { skip: Number.isNaN(productId) });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const initialPrice = useMemo(() => {
    if (!product) return '';
    const value = typeof product.price === 'string' ? product.price : product.price.toString();
    return value;
  }, [product]);

  const formik = useFormik({
    initialValues: {
      title: product?.title || '',
      description: product?.description || '',
      image: product?.image || '',
      category: (product?.category || '') as ProductCategory | '',
      price: initialPrice,
      availability: product?.availability ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await updateProduct({
          id: productId,
          data: {
            title: values.title,
            description: values.description,
            image: values.image,
            category: values.category as ProductCategory,
            price: parseFloat(values.price),
            availability: values.availability,
          },
        }).unwrap();
        router.push(`/products/${productId}`);
      } catch (updateError) {
        console.error('Error updating product:', updateError);
      }
    },
  });

  if (Number.isNaN(productId)) {
    return <div className={styles.error}>Invalid product identifier</div>;
  }

  if (isLoading) return <div className={styles.loading}>Loading product...</div>;
  if (error || !product) return <div className={styles.error}>Product not found</div>;

  return (
    <div className={styles.container}>
      <h1>Edit Product</h1>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.input}
          />
          {formik.touched.title && formik.errors.title && (
            <div className={styles.error}>{formik.errors.title}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.textarea}
            rows={4}
          />
          {formik.touched.description && formik.errors.description && (
            <div className={styles.error}>{formik.errors.description}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Image URL *</label>
          <input
            id="image"
            name="image"
            type="url"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.input}
          />
          {formik.touched.image && formik.errors.image && (
            <div className={styles.error}>{formik.errors.image}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.select}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className={styles.error}>{formik.errors.category}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Price *</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={styles.input}
          />
          {formik.touched.price && formik.errors.price && (
            <div className={styles.error}>{formik.errors.price}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="availability">Availability *</label>
          <select
            id="availability"
            name="availability"
            value={formik.values.availability.toString()}
            onChange={(e) => formik.setFieldValue('availability', e.target.value === 'true')}
            className={styles.select}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push(`/products/${productId}`)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" disabled={isUpdating} className={styles.submitButton}>
            {isUpdating ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}


