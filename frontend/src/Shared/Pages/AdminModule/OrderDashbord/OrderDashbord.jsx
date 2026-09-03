// OrderDashbord.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import api from "../../../../Api/Axios";
import { FiEye } from "react-icons/fi";
import styles from "./OrderDashbord.module.css";
import OrderDetails from "./OrderDetails";

const STAGGER_DELAY = 60; // rows ke beech gap — table isliye chhota rakha hai (60ms) kyunki rows jyada honge

const OrderDashbord = () => {

  const [visibleOrders, setVisibleOrders] = useState([]); // staggered reveal
  const [totalOrders, setTotalOrders] = useState([]);      // stats ke liye poori list
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const staggerTimeouts = useRef([]);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch) => {
    batch.forEach((order, i) => {
      const timeoutId = setTimeout(() => {
        setVisibleOrders((prev) => [...prev, order]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  useEffect(() => {
    GetOrders();
    return () => clearStaggerTimeouts();
  }, []);

  const GetOrders = async () => {
    try {
      setLoading(true);
      clearStaggerTimeouts();
      setVisibleOrders([]);

      const { data } = await api.get("/v1/order/admin");

      if (data.success) {
        const fetched = data.data.orders || [];
        setTotalOrders(fetched);
        if (fetched.length > 0) {
          revealStaggered(fetched);
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      totalOrders: totalOrders.length,

      totalRevenue: totalOrders.reduce((sum, order) => sum + order.totalAmount, 0),

      pendingOrders: totalOrders.filter((order) => order.orderStatus === "Pending")
        .length,

      deliveredOrders: totalOrders.filter(
        (order) => order.orderStatus === "Delivered",
      ).length,

      cancelledOrders: totalOrders.filter(
        (order) => order.orderStatus === "Cancelled",
      ).length,
    };
  }, [totalOrders]);

  // ---------------- Skeleton pieces ----------------
  const SkeletonStatCard = ({ delay = 0 }) => (
    <div className={styles.statCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "50%", height: "10px" }} />
      <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "40%", height: "22px", marginTop: "10px" }} />
    </div>
  );

  const SkeletonTableRow = ({ delay = 0 }) => (
    <tr className={styles.skeletonRow} style={{ animationDelay: `${delay}ms` }}>
      <td><div className={styles.tableImages}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 38, height: 48, borderRadius: 6 }} />
        ))}
      </div></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "100px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "20px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "50px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px" }} /></td>
      <td><div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px" }} /></td>
      <td><div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 34, height: 34, borderRadius: 8 }} /></td>
    </tr>
  );

  const SkeletonMobileCard = ({ delay = 0 }) => (
    <div className={styles.orderCard} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardHeader}>
        <div>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "80px", height: "12px" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px", height: "10px", marginTop: "6px" }} />
        </div>
        <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 34, height: 34, borderRadius: 8 }} />
      </div>
      <div className={styles.imagesRow}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 50, height: 60, borderRadius: 8 }} />
        ))}
      </div>
      <div className={styles.infoGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "50%", height: "9px" }} />
            <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "70%", height: "12px", marginTop: "4px" }} />
          </div>
        ))}
      </div>
    </div>
  );

  // ---------------- Loading (skeleton dashboard) ----------------
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Order Dashboard</h2>
        </div>

        <div className={styles.statsGrid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonStatCard key={i} delay={i * 60} />
          ))}
        </div>

        <div className={styles.desktopView}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Order No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonTableRow key={i} delay={i * 60} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.mobileView}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonMobileCard key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Order Dashboard</h2>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Orders</span>
          <h3>{stats.totalOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Revenue</span>
          <h3>₹{stats.totalRevenue}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Pending</span>
          <h3>{stats.pendingOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Delivered</span>
          <h3>{stats.deliveredOrders}</h3>
        </div>

        <div className={styles.statCard}>
          <span>Cancelled</span>
          <h3>{stats.cancelledOrders}</h3>
        </div>
      </div>

      {/* Desktop Table */}
      <div className={styles.desktopView}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Products</th>
                <th>Order No</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={styles.animatedRow}
                  style={{ animationDelay: `${(index % 20) * 0.03}s` }}
                >
                  <td>
                    <div className={styles.tableImages}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.coverImage?.url} alt="" />
                      ))}
                    </div>
                  </td>

                  <td>{order.orderNumber}</td>
                  <td>{order.shippingAddress?.fullName}</td>
                  <td>{order.items.length}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.orderStatus}</td>

                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileView}>
        {visibleOrders.map((order, index) => (
          <div
            key={order._id}
            className={`${styles.orderCard} ${styles.animatedRow}`}
            style={{ animationDelay: `${(index % 20) * 0.03}s` }}
          >
            <div className={styles.cardHeader}>
              <div>
                <h4>{order.orderNumber}</h4>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <button
                className={styles.viewBtn}
                onClick={() => setSelectedOrder(order)}
              >
                <FiEye />
              </button>
            </div>

            <div className={styles.imagesRow}>
              {order.items.slice(0, 4).map((item, i) => (
                <img
                  key={i}
                  src={item.coverImage?.url}
                  alt={item.productName}
                  className={styles.productImage}
                />
              ))}

              {order.items.length > 4 && (
                <div className={styles.moreImages}>
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            <div className={styles.infoGrid}>
              <div>
                <label>Customer</label>
                <p>{order.shippingAddress?.fullName}</p>
              </div>
              <div>
                <label>Items</label>
                <p>{order.items.length}</p>
              </div>
              <div>
                <label>Total</label>
                <p>₹{order.totalAmount}</p>
              </div>
              <div>
                <label>Payment</label>
                <p>{order.paymentMethod}</p>
              </div>
            </div>

            <div className={styles.statusRow}>
              <span
                className={`${styles.badge} ${
                  styles[order.orderStatus.toLowerCase()]
                }`}
              >
                {order.orderStatus}
              </span>

              <span
                className={`${styles.badge} ${
                  styles[order.paymentStatus.toLowerCase()]
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          refreshOrders={GetOrders}
        />
      )}
    </div>
  );
};

export default OrderDashbord;