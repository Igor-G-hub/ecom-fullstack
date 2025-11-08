import styles from "./ProductDetailSkeleton.module.scss";

export default function ProductDetailSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageSection}>
        <div className={styles.imagePlaceholder} />
      </div>
      <div className={styles.infoSection}>
        <div className={styles.titlePlaceholder} />
        <div className={styles.priceRow}>
          <div className={styles.pricePlaceholder} />
          <div className={styles.badgePlaceholder} />
        </div>
        <div className={styles.descriptionSection}>
          <div className={styles.descriptionLabelPlaceholder} />
          <div className={styles.descriptionPlaceholder} />
          <div className={styles.descriptionPlaceholder} />
          <div className={styles.descriptionPlaceholder} style={{ width: "60%" }} />
        </div>
        <div className={styles.actions}>
          <div className={styles.buttonPlaceholder} />
          <div className={styles.buttonPlaceholder} />
        </div>
      </div>
    </div>
  );
}

