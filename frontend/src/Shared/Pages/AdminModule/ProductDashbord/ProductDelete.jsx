import { useState, useEffect } from "react";
import api from "../../../../Api/Axios";
import styles from "./ProductDelete.module.css";

function ProductDelete({ product, onClose, onDeleted }) {


  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!product) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      const response = await api.delete(
        `/v1/products/delete/${product._id}`
      );

      if (response.data?.success === false) {
        setError(
          response.data?.message ||
            "Unable to delete this product."
        );
        return;
      }

      if (onDeleted) {
        onDeleted(product._id);
      }

      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to delete this product."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>Delete Product?</h3>

        <p className={styles.message}>
          Are you sure you want to permanently delete
          <strong> "{product.productName}" </strong>
          from the catalog?
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDelete;


