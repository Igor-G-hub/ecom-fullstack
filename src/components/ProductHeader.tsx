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
      <div className={styles.logo}>
        <svg
          className={styles.logoIcon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 9L12 3L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.logoText}>Warehouse</span>
      </div>
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

