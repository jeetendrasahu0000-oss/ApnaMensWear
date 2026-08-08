// import React from 'react'
// import styles from './AddToCart.module.css'

// const AddToCart = () => {
//   return (
//     <div>AddToCart</div>
//   )
// }

// export  default AddToCart




import React, { useState } from "react";
import api from "../../../Api/Axios";
import styles from "./AddToCart.module.css";

const AddToCart = ({ product, onClose }) => {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    try {
      setError("");

      if (!variantId) {
        setError("Please select a variant");
        return;
      }

      setLoading(true);

      const { data } = await api.post(
        "/v1/cart/add",
        {
          productId: product._id,
          variantId,
          quantity,
        }
      );

      if (data.success) {
        onClose();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className={styles.header}>
          <h2>Add To Cart</h2>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <h3 className={styles.productName}>
          {product.productName}
        </h3>

        <div className={styles.section}>
          <label>
            Select Variant
          </label>

          <select
            value={variantId}
            onChange={(e) =>
              setVariantId(e.target.value)
            }
          >
            <option value="">
              Choose Variant
            </option>

            {product.variants?.map(
              (variant) => (
                <option
                  key={variant._id}
                  value={variant._id}
                >
                  {variant.color} |{" "}
                  {variant.size} | Stock:
                  {" "}
                  {variant.stock}
                </option>
              )
            )}
          </select>
        </div>

        <div className={styles.section}>
          <label>Quantity</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Number(e.target.value)
              )
            }
          />
        </div>

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

        <button
          className={styles.addBtn}
          disabled={loading}
          onClick={handleAddToCart}
        >
          {loading
            ? "Adding..."
            : "Add To Cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;

