// ViewCartProduct.jsx
import React, { useEffect, useState } from "react";
import api from "../../../Api/Axios";
import styles from "./ViewCartProduct.module.css";
import CreateOrder from "../Order/CreateOrder";
import { FiX, FiShoppingBag, FiTrash2, FiCreditCard, FiMinus, FiPlus } from "react-icons/fi";

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
    const selectedVariant = item.productId.variants.find(
      (variant) => variant._id.toString() === item.variantId.toString()
    );

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
    const products = cartItems.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      selectedVariant: item.productId.variants.find(
        (variant) => variant._id.toString() === item.variantId.toString()
      ),
    }));

    setOrderProducts(products);
    setCreateOrderOpen(true);
  };

  const totalProducts = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.productId.salePrice || item.productId.price) * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (total, item) =>
      total + (item.productId.price - item.productId.salePrice) * item.quantity,
    0
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FiShoppingBag className={styles.headerIcon} />
            <h2 className={styles.heading}>My Cart</h2>
            {!loading && cartItems.length > 0 && (
              <span className={styles.itemCount}>{cartItems.length} items</span>
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

        {!loading && !error && cartItems.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart</p>
            <button className={styles.shopBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <>
            <div className={styles.products}>
              {cartItems.map((item) => {
                const product = item.productId;
                const selectedVariant = product.variants.find(
                  (variant) => variant._id.toString() === item.variantId.toString()
                );
                const isUpdating = updatingQuantity === item.variantId;

                return (
                  <div key={item._id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img
                        src={product.coverImage?.url || product.coverImage}
                        alt={product.productName}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.content}>
                      <div className={styles.contentHeader}>
                        <h3 className={styles.productName}>{product.productName}</h3>
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
                        <span className={styles.salePrice}>₹{product.salePrice}</span>
                        {product.price > product.salePrice && (
                          <span className={styles.originalPrice}>₹{product.price}</span>
                        )}
                        {product.price > product.salePrice && (
                          <span className={styles.discountTag}>
                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
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
                          ₹{product.salePrice * item.quantity}
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