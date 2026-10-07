import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminHeader from "./AdminHeader/AdminHeader";
import AdminSidebar from "./AdminSideBar/AdminSidebar";
import SalesReport from "./SalesReport/SalesReport";
import ProductDashbord from "./ProductDashbord/ProductDashbord";
import OrderDashbord from "./OrderDashbord/OrderDashbord";
import PaymentDashbord from "./PaymentDashbord/PaymentDashbord";
import CategoryDashboard from "./CategoryDashboard/CategoryDashboard";
import UserDashboard from "./UserDashbord/UserDashbord";
import styles from "./AdminDashbord.module.css";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminWrapper}>
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={styles.mainArea}>
        <AdminHeader toggleSidebar={() => setSidebarOpen((p) => !p)} />

        <div className={styles.contentArea}>
          <Routes>
            {/* Default → Sales */}
            <Route index element={<Navigate to="sales" replace />} />

            {/* All tabs */}
            <Route path="sales" element={<SalesReport />} />
            <Route path="orders" element={<OrderDashbord />} />
            <Route path="payments" element={<PaymentDashbord />} />
            <Route path="products" element={<ProductDashbord />} />
            <Route path="categories" element={<CategoryDashboard />} />
            <Route path="users" element={<UserDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="sales" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;