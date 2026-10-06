import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminHeader from "./AdminHeader/AdminHeader";
import AdminSidebar from "./AdminSideBar/AdminSidebar";
import SalesReport from "./SalesReport/SalesReport";
import ProductDashbord from "../AdminModule/ProductDashbord/ProductDashbord";
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
            <Route index element={<Navigate to="sales" replace />} />
            <Route path="sales" element={<SalesReport />} />
            <Route path="products" element={<ProductDashbord />} />
            <Route path="users" element={<div style={{ padding: 24 }}>Users — coming soon</div>} />

            {/* Ye 3 routes abhi placeholder hain — jab unki files ban jaayengi to uncomment kar do */}
            {/* <Route path="orders" element={<OrderDashbord />} /> */}
            {/* <Route path="payments" element={<PaymentDashbord />} /> */}
            {/* <Route path="categories" element={<CategoryDashboard />} /> */}

            <Route path="*" element={<Navigate to="sales" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;