// PaymentDashbord.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../../../../Api/Axios";
import styles from "./PaymentDashbord.module.css";

const STAGGER_DELAY = 60; // rows ke beech gap (ms)

const PaymentDashbord = () => {

  const [visiblePayments, setVisiblePayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(null);

  const staggerTimeouts = useRef([]);

  const clearStaggerTimeouts = () => {
    staggerTimeouts.current.forEach(clearTimeout);
    staggerTimeouts.current = [];
  };

  const revealStaggered = (batch) => {
    batch.forEach((payment, i) => {
      const timeoutId = setTimeout(() => {
        setVisiblePayments((prev) => [...prev, payment]);
      }, i * STAGGER_DELAY);
      staggerTimeouts.current.push(timeoutId);
    });
  };

  const GetPayments = async () => {
    try {
      setLoading(true);
      clearStaggerTimeouts();
      setVisiblePayments([]);

      const response = await api.get("/v1/payment/admin/all");

      if (response?.data?.success) {
        const fetched = response.data.data.payments || [];
        if (fetched.length > 0) {
          revealStaggered(fetched);
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to fetch payments"
      );
    } finally {
      setLoading(false);
    }
  };

  const RefundPayment = async (paymentId) => {
    try {
      const confirmRefund = window.confirm(
        "Are you sure you want to refund this payment?"
      );

      if (!confirmRefund) return;

      setRefundLoading(paymentId);

      const response = await api.post(
        `/v1/payment/refund/${paymentId}`
      );

      if (response?.data?.success) {
        alert(response.data.message);
        GetPayments();
      }
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Failed to refund payment"
      );
    } finally {
      setRefundLoading(null);
    }
  };

  useEffect(() => {
    GetPayments();
    return () => clearStaggerTimeouts();
  }, []);

  // ---------------- Skeleton pieces ----------------
  const SkeletonTableRow = ({ delay = 0 }) => (
    <tr className={styles.skeletonRow} style={{ animationDelay: `${delay}ms` }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: i === 0 ? "90px" : "70px" }} />
        </td>
      ))}
      <td>
        <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 70, height: 28, borderRadius: 8 }} />
      </td>
    </tr>
  );

  const SkeletonCard = ({ delay = 0 }) => (
    <div className={styles.card} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.cardTop}>
        <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "100px", height: "13px" }} />
        <div className={`${styles.skeletonBlock} ${styles.skeletonPulse}`} style={{ width: 60, height: 20, borderRadius: 20 }} />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.cardRow}>
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "60px", height: "10px" }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonPulse}`} style={{ width: "80px", height: "10px" }} />
        </div>
      ))}
    </div>
  );

  // ---------------- Loading (skeleton dashboard) ----------------
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Payment Dashboard</h2>
        </div>

        <div className={styles.desktopView}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>payment_id</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Order Id</th>
                  <th>Razorpay_Payment_Id</th>
                  <th>Paid At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonTableRow key={i} delay={i * 60} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.mobileView}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 60} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Payment Dashboard</h2>
      </div>

      {/* Desktop Table */}
      <div className={styles.desktopView}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>payment_id</th>
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Order Id</th>
                <th>Razorpay_Payment_Id</th>
                <th>Paid At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {visiblePayments.length > 0 ? (
                visiblePayments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className={styles.animatedRow}
                    style={{ animationDelay: `${(index % 20) * 0.03}s` }}
                  >
                    <td>{payment._id}</td>

                    <td>
                      {payment?.user?.firstName}{" "}
                      {payment?.user?.lastName}
                    </td>

                    <td>{payment?.user?.email || "-"}</td>

                    <td>
                      ₹{payment?.amount?.toLocaleString() || 0}
                    </td>

                    <td>{payment?.paymentMethod || "-"}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[payment?.status?.toLowerCase()]
                        }`}
                      >
                        {payment?.status}
                      </span>
                    </td>

                    <td>{payment?.razorpayOrderId || "-"}</td>

                    <td>{payment?.razorpayPaymentId || "-"}</td>

                    <td>
                      {payment?.paidAt
                        ? new Date(payment.paidAt).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      {payment?.status === "Paid" ? (
                        <button
                          className={styles.refundBtn}
                          onClick={() => RefundPayment(payment._id)}
                          disabled={refundLoading === payment._id}
                        >
                          {refundLoading === payment._id
                            ? "Processing..."
                            : "Refund"}
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No Payments Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileView}>
        {visiblePayments.length > 0 ? (
          visiblePayments.map((payment, index) => (
            <div
              key={payment._id}
              className={`${styles.card} ${styles.animatedRow}`}
              style={{ animationDelay: `${(index % 20) * 0.03}s` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardUser}>
                  {payment?.user?.firstName}{" "}
                  {payment?.user?.lastName}
                </div>

                <span
                  className={`${styles.status} ${
                    styles[payment?.status?.toLowerCase()]
                  }`}
                >
                  {payment?.status}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>
                  {payment?.user?.email || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Amount</span>
                <span className={styles.value}>
                  ₹{payment?.amount?.toLocaleString() || 0}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Method</span>
                <span className={styles.value}>
                  {payment?.paymentMethod || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Order ID</span>
                <span className={styles.value}>
                  {payment?.razorpayOrderId || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Payment ID</span>
                <span className={styles.value}>
                  {payment?.razorpayPaymentId || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>Paid At</span>
                <span className={styles.value}>
                  {payment?.paidAt
                    ? new Date(payment.paidAt).toLocaleString()
                    : "-"}
                </span>
              </div>

              {payment?.status === "Paid" && (
                <div className={styles.cardAction}>
                  <button
                    className={styles.refundBtn}
                    onClick={() => RefundPayment(payment._id)}
                    disabled={refundLoading === payment._id}
                  >
                    {refundLoading === payment._id
                      ? "Processing..."
                      : "Refund Payment"}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noData}>No Payments Found</div>
        )}
      </div>
    </div>
  );
};

export default PaymentDashbord;