"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateProductMutation } from "@/store/api/productsApi";
import { ProductCategory } from "@prisma/client";
import { useEffect, useMemo } from "react";
import styles from "./AddProductDialog.module.scss";

const CATEGORIES: ProductCategory[] = [
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

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string | ProductCategory;
  price: number | string;
  availability: boolean;
}

interface EditProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product: Product | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  category: Yup.string().oneOf(CATEGORIES).required("Category is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  availability: Yup.boolean().required("Availability is required"),
});

export default function EditProductDialog({
  isOpen,
  onClose,
  onSuccess,
  product,
}: EditProductDialogProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const initialPrice = useMemo(() => {
    if (!product) return "";
    const value =
      typeof product.price === "string"
        ? product.price
        : product.price.toString();
    return value;
  }, [product]);

  const formik = useFormik({
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      image: product?.image || "",
      category: (product?.category || "") as ProductCategory | "",
      price: initialPrice,
      availability: product?.availability ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (!product) return;

      try {
        await updateProduct({
          id: product.id,
          data: {
            title: values.title,
            description: values.description,
            image: values.image,
            category: values.category as ProductCategory,
            price: parseFloat(values.price),
            availability: values.availability,
          },
        }).unwrap();
        formik.resetForm();
        onClose();
        onSuccess?.();
      } catch (error) {
        alert("Error updating product");
        console.error("Error updating product:", error);
      }
    },
  });

  // Update form values when product changes
  useEffect(() => {
    if (product) {
      const priceValue =
        typeof product.price === "string"
          ? product.price
          : product.price.toString();

      formik.setValues({
        title: product.title,
        description: product.description,
        image: product.image,
        category: product.category as ProductCategory,
        price: priceValue,
        availability: product.availability,
      });
    }
  }, [product]);

  const [isClosing, setIsClosing] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(isOpen && !!product);

  useEffect(() => {
    if (isOpen && product) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, product, shouldRender]);

  if (!shouldRender || !product) return null;

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={onClose}
    >
      <div
        className={`${styles.dialog} ${isClosing ? styles.dialogClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Edit Product</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

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
              onChange={(e) =>
                formik.setFieldValue("availability", e.target.value === "true")
              }
              className={styles.select}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

