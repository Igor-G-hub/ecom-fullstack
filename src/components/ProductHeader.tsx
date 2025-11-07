"use client";

import { useAuth } from "@/contexts/AuthContext";
import styles from "./ProductHeader.module.scss";

interface ProductHeaderProps {
  onAddProduct: () => void;
}

export default function ProductHeader({ onAddProduct }: ProductHeaderProps) {
  const { logout } = useAuth();

  return (
    <div className={styles.header}>
      <div className={styles.headerActions}>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
        <button className={styles.addBtn} onClick={onAddProduct}>
          <span className={styles.plusIcon}>+</span>
          Add Product
        </button>
      </div>
    </div>
  );
}

