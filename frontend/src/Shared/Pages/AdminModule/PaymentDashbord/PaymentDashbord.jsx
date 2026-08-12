

import React, { useEffect, useState } from "react";
import api from "../../../../Api/Axios";
import styles from "./PaymentDashbord.module.css";

const PaymentDashbord = () => {
    
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(null);

  const GetPayments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/v1/payment/admin/all");

      if (response?.data?.success) {
        setPayments(response.data.data.payments || []);
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
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        Loading Payments...
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
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      {payment._id}
                    </td>
                    <td>
                      {payment?.user?.firstName}{" "}
                      {payment?.user?.lastName}
                    </td>

                    <td>
                      {payment?.user?.email || "-"}
                    </td>

                    <td>
                      ₹
                      {payment?.amount?.toLocaleString() ||
                        0}
                    </td>

                    <td>
                      {payment?.paymentMethod || "-"}
                    </td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[
                            payment?.status?.toLowerCase()
                          ]
                        }`}
                      >
                        {payment?.status}
                      </span>
                    </td>

                    <td>
                      {payment?.razorpayOrderId || "-"}
                    </td>

                    <td>
                      {payment?.razorpayPaymentId || "-"}
                    </td>

                    <td>
                      {payment?.paidAt
                        ? new Date(
                            payment.paidAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      {payment?.status === "Paid" ? (
                        <button
                          className={styles.refundBtn}
                          onClick={() =>
                            RefundPayment(payment._id)
                          }
                          disabled={
                            refundLoading === payment._id
                          }
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
                  <td colSpan="9">
                    No Payments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileView}>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment._id}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardUser}>
                  {payment?.user?.firstName}{" "}
                  {payment?.user?.lastName}
                </div>

                <span
                  className={`${styles.status} ${
                    styles[
                      payment?.status?.toLowerCase()
                    ]
                  }`}
                >
                  {payment?.status}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Email
                </span>
                <span className={styles.value}>
                  {payment?.user?.email || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Amount
                </span>
                <span className={styles.value}>
                  ₹
                  {payment?.amount?.toLocaleString() ||
                    0}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Method
                </span>
                <span className={styles.value}>
                  {payment?.paymentMethod || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Order ID
                </span>
                <span className={styles.value}>
                  {payment?.razorpayOrderId || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Payment ID
                </span>
                <span className={styles.value}>
                  {payment?.razorpayPaymentId || "-"}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.label}>
                  Paid At
                </span>
                <span className={styles.value}>
                  {payment?.paidAt
                    ? new Date(
                        payment.paidAt
                      ).toLocaleString()
                    : "-"}
                </span>
              </div>

              {payment?.status === "Paid" && (
                <div className={styles.cardAction}>
                  <button
                    className={styles.refundBtn}
                    onClick={() =>
                      RefundPayment(payment._id)
                    }
                    disabled={
                      refundLoading === payment._id
                    }
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
          <div className={styles.noData}>
            No Payments Found
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDashbord;



