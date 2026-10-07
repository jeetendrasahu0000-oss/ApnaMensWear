// MyOrder.jsx
import React, { useEffect, useState, useRef } from "react";
import { FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/Axios";
import styles from "./MyOrder.module.css";

const STAGGER_DELAY = 150;

const MyOrder = () => {
  const navigate = useNavigate();

  const [visibleOrders, setVisibleOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const staggerTimeouts = useRef([]);
  const requestIdRef = useRef(0);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch, requestId) => {
    batch.forEach((order, i) => {
      const timeoutId = setTimeout(() => {
        if (requestIdRef.current !== requestId) return;
        setVisibleOrders((prev) => [...prev, order]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  useEffect(() => {
    GetOrders();
    return () => {
      requestIdRef.current += 1;
      clearStaggerTimeouts();
    };
  }, []);

  const GetOrders = async () => {
    const currentRequestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError("");
      clearStaggerTimeouts();
      setVisibleOrders([]);

      const { data } = await api.get("/v1/order");

      if (requestIdRef.current !== currentRequestId) return;

      if (data.success) {
        const fetched = data.data || [];
        setTotalCount(fetched.length);
        if (fetched.length > 0) {
          revealStaggered(fetched, currentRequestId);
        }
      }
    } catch (error) {
      if (requestIdRef.current !== currentRequestId) return;
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      if (requestIdRef.current === currentRequestId) {
        setLoading(false);
      }
    }
  };

  // ======================================================
  // PRODUCT CLICK — slug based, with debug logs
  // ======================================================
  const HandleProductClick = (item) => {
    console.log("🖱️ Product clicked:", item);

    const slug =
      item?.slug ||
      item?.productSlug ||
      (typeof item?.product === "object" ? item.product?.slug : null);

    console.log("📎 Extracted slug:", slug);

    if (!slug) {
      console.warn("❌ No slug found for product item:", item);
      alert("Product link not available. Please try again later.");
      return;
    }

    navigate(`/product/${slug}`);
  };

  // ---------------- Skeleton ----------------
  const SkeletonOrderCard = ({ delay = 0 }) => (
    <div className={styles.orderCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.orderHeader}>
        <div>
          <div
            className={`${styles.skeletonLine} ${styles.skeletonPulse}`}
            style={{ width: "100px", height: "13px" }}
          />
          <div
            className={`${styles.skeletonLine} ${styles.skeletonPulse}`}
            style={{ width: "70px", height: "10px", marginTop: "6px" }}
          />
        </div>
        <div
          className={`${styles.skeletonBlock} ${styles.skeletonPulse}`}
          style={{ width: 70, height: 22, borderRadius: 999 }}
        />
      </div>

      <div className={styles.products}>
        {[1, 2].map((i) => (
          <div key={i} className={styles.productCard}>
            <div
              className={`${styles.skeletonBlock} ${styles.skeletonPulse}`}
              style={{ width: 65, height: 80, borderRadius: 8 }}
            />
            <div className={styles.productInfo}>
              <div
                className={`${styles.skeletonLine} ${styles.skeletonPulse}`}
                style={{ width: "70%", height: "12px" }}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonPulse}`}
                style={{ width: "50%", height: "10px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h2>My Orders</h2>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonOrderCard key={i} delay={i * 100} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!totalCount) {
    return (
      <div className={styles.stateContainer}>
        <FiPackage size={50} />
        <h3>No Orders Found</h3>
        <p>You haven't placed any orders yet.</p>
        <button
          className={styles.shopBtn}
          onClick={() => navigate("/")}
          type="button"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2>My Orders</h2>
        <span>
          {totalCount} Order{totalCount > 1 ? "s" : ""}
        </span>
      </div>

      {visibleOrders.map((order, index) => (
        <div
          key={order._id}
          className={`${styles.orderCard} ${styles.animatedCard}`}
          style={{ animationDelay: `${(index % 10) * 0.06}s` }}
        >
          <div className={styles.orderHeader}>
            <div>
              <h4>{order.orderNumber}</h4>
              <p>{new Date(order.placedAt).toLocaleDateString()}</p>
            </div>

            <div className={styles.orderMeta}>
              <span
                className={`${styles.badge} ${
                  styles[order.orderStatus?.toLowerCase()]
                }`}
              >
                {order.orderStatus}
              </span>
              <span className={styles.paymentBadge}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Products */}
          <div className={styles.products}>
            {order.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                type="button"
                className={styles.productCard}
                onClick={() => HandleProductClick(item)}
              >
                <img
                  src={item.coverImage?.url || item.coverImage}
                  alt={item.productName}
                  className={styles.productImage}
                />

                <div className={styles.productInfo}>
                  <h5>{item.productName}</h5>

                  <div className={styles.variantRow}>
                    <span>Color: {item.selectedVariant?.color}</span>
                    <span>Size: {item.selectedVariant?.size}</span>
                  </div>

                  <div className={styles.productBottom}>
                    <span>Qty: {item.quantity}</span>
                    <strong>₹{item.priceAtPurchase}</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div>
              <span>Total</span>
              <strong>₹{order.totalAmount}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{order.items.length}</strong>
            </div>
          </div>

          {/* Delivery */}
          <div className={styles.deliveryInfo}>
            Deliver to <strong>{order.shippingAddress.fullName}</strong> •{" "}
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;