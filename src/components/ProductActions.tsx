"use client";

import { useRouter } from "next/navigation";
import { useDeleteProductMutation } from "@/store/api/productsApi";
import { useState } from "react";
import EditProductDialog from "@/components/EditProductDialog";
import styles from "@/app/products/[id]/page.module.scss";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | string;
  availability: boolean;
}

interface ProductActionsProps {
  productId: number;
  product: Product;
}

export default function ProductActions({
  productId,
  product,
}: ProductActionsProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (Number.isNaN(productId)) return;

    try {
      setDeleteError(null);
      await deleteProduct(productId).unwrap();
      router.push("/");
    } catch (err) {
      console.error("Failed to delete product", err);
      setDeleteError("Failed to delete product. Please try again.");
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditOpen(false);
    // Refresh the page to show updated product
    router.refresh();
  };

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsEditOpen(true)}
        >
          Update Product
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
      {deleteError && <div className={styles.deleteError}>{deleteError}</div>}
      <EditProductDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleUpdateSuccess}
        product={product}
      />
    </>
  );
}
