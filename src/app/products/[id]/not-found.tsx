import Link from "next/link";
import styles from "./page.module.scss";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.error}>Product not found</div>
        <Link href="/" className={styles.backLink}>
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}

