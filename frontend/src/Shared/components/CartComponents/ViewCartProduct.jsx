// ViewCartProduct.jsx
import React, { useEffect, useState } from "react";
import api from "../../../Api/Axios";
import styles from "./ViewCartProduct.module.css";
import CreateOrder from "../Order/CreateOrder";
import { FiX, FiShoppingBag, FiTrash2, FiCreditCard, FiMinus, FiPlus, FiAlertTriangle } from "react-icons/fi";

const ViewCartProduct = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removeItem, setRemoveItem] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [updatingQuantity, setUpdatingQuantity] = useState(null);

  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);

  useEffect(() => {
    GetCartProducts();
  }, []);

  const GetCartProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/v1/cart");

      if (data.success) {
        setCartItems(data.data?.items || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch cart products");
    } finally {
      setLoading(false);
    }
  };

  // FIX: sirf wahi items rakho jinka product data (populate) actually mila hai.
  // Agar product delete ho gaya ho ya backend se populate na hua ho, to
  // pehle ye crash karta tha (blank screen). Ab aise items ko safely alag
  // karke user ko dikha dete hain ki kuch items unavailable hain.
  const validItems = cartItems.filter(
    (item) => item?.productId && typeof item.productId === "object"
  );
  const unavailableCount = cartItems.length - validItems.length;

  const getSelectedVariant = (item) => {
    const variants = item?.productId?.variants || [];
    return variants.find(
      (variant) => variant?._id?.toString() === item?.variantId?.toString()
    );
  };

  const HandleRemove = async (variantId) => {
    try {
      setRemoving(true);
      const { data } = await api.delete(`/v1/cart/remove/${variantId}`);

      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
        setRemoveItem(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    } finally {
      setRemoving(false);
    }
  };

  const HandleUpdateQuantity = async (variantId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      setUpdatingQuantity(variantId);
      const { data } = await api.put(`/v1/cart/update/${variantId}`, {
        quantity: newQuantity,
      });

      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.variantId === variantId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const HandleBuyNow = (item) => {
    if (!item?.productId) return;

    const selectedVariant = getSelectedVariant(item);

    setOrderProducts([
      {
        product: item.productId,
        quantity: item.quantity,
        selectedVariant,
      },
    ]);

    setCreateOrderOpen(true);
  };

  const HandleBuyAll = () => {
    const products = validItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      selectedVariant: getSelectedVariant(item),
    }));

    setOrderProducts(products);
    setCreateOrderOpen(true);
  };

  const totalProducts = validItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const totalAmount = validItems.reduce((total, item) => {
    const price = item.productId?.salePrice ?? item.productId?.price ?? 0;
    return total + price * (item.quantity || 0);
  }, 0);

  const totalSavings = validItems.reduce((total, item) => {
    const original = item.productId?.price ?? 0;
    const sale = item.productId?.salePrice ?? original;
    return total + (original - sale) * (item.quantity || 0);
  }, 0);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FiShoppingBag className={styles.headerIcon} />
            <h2 className={styles.heading}>My Cart</h2>
            {!loading && validItems.length > 0 && (
              <span className={styles.itemCount}>{validItems.length} items</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your cart...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && unavailableCount > 0 && (
          <div className={styles.error}>
            <FiAlertTriangle className={styles.errorIcon} />
            <p>
              {unavailableCount} item{unavailableCount > 1 ? "s" : ""} in your cart{" "}
              {unavailableCount > 1 ? "are" : "is"} no longer available and won't be shown.
            </p>
          </div>
        )}

        {!loading && !error && validItems.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart</p>
            <button className={styles.shopBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {!loading && !error && validItems.length > 0 && (
          <>
            <div className={styles.products}>
              {validItems.map((item) => {
                const product = item.productId;
                const selectedVariant = getSelectedVariant(item);
                const isUpdating = updatingQuantity === item.variantId;

                const price = product.salePrice ?? product.price ?? 0;
                const originalPrice = product.price ?? price;

                return (
                  <div key={item._id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.coverImage?.url || product.coverImage || ""}
                        alt={product.productName || "Product"}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.content}>
                      <div className={styles.contentHeader}>
                        <h3 className={styles.productName}>{product.productName || "Unnamed product"}</h3>
                        <button
                          className={styles.removeBtn}
                          onClick={() => setRemoveItem(item)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className={styles.variantInfo}>
                        <span className={styles.variantTag}>
                          Color: {selectedVariant?.color || "N/A"}
                        </span>
                        <span className={styles.variantTag}>
                          Size: {selectedVariant?.size || "N/A"}
                        </span>
                      </div>

                      <div className={styles.priceRow}>
                        <span className={styles.salePrice}>₹{price}</span>
                        {originalPrice > price && (
                          <span className={styles.originalPrice}>₹{originalPrice}</span>
                        )}
                        {originalPrice > price && (
                          <span className={styles.discountTag}>
                            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <div className={styles.quantityRow}>
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              HandleUpdateQuantity(item.variantId, item.quantity, -1)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className={styles.qtyValue}>
                            {isUpdating ? "..." : item.quantity}
                          </span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              HandleUpdateQuantity(item.variantId, item.quantity, 1)
                            }
                            disabled={isUpdating}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <span className={styles.itemTotal}>
                          ₹{price * item.quantity}
                        </span>
                      </div>

                      <button
                        className={styles.buyBtn}
                        onClick={() => HandleBuyNow(item)}
                      >
                        <FiCreditCard />
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className={styles.cartSummary}>
              <div className={styles.summaryLeft}>
                <div className={styles.summaryItem}>
                  <span>Total Items</span>
                  <strong>{totalProducts}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span>Total Amount</span>
                  <strong>₹{totalAmount}</strong>
                </div>
                {totalSavings > 0 && (
                  <div className={styles.summaryItem}>
                    <span>You Save</span>
                    <strong className={styles.savings}>₹{totalSavings}</strong>
                  </div>
                )}
              </div>
              <button className={styles.buyAllBtn} onClick={HandleBuyAll}>
                Buy All ({totalProducts} items)
              </button>
            </div>
          </>
        )}

        {/* Remove Confirmation */}
        {removeItem && (
          <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
              <div className={styles.confirmIcon}>🗑️</div>
              <h3>Remove Item</h3>
              <p>Are you sure you want to remove this item from your cart?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setRemoveItem(null)}
                  disabled={removing}
                >
                  Cancel
                </button>
                <button
                  className={styles.confirmRemoveBtn}
                  onClick={() => HandleRemove(removeItem.variantId)}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {createOrderOpen && (
          <CreateOrder
            products={orderProducts}
            onClose={() => setCreateOrderOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewCartProduct;