import { NavLink } from "react-router-dom";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const closeOnMobile = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.active : ""}`;

  return (
    <>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <h3 className={styles.logo}>Admin</h3>

        <NavLink to="/admin/sales" className={linkClass} onClick={closeOnMobile}>
          Sales Report
        </NavLink>

        <NavLink to="/admin/products" className={linkClass} onClick={closeOnMobile}>
          Products
        </NavLink>

        <NavLink to="/admin/users" className={linkClass} onClick={closeOnMobile}>
          Users
        </NavLink>

        {/* Ye 3 abhi placeholder hain — jab files ban jaayengi to uncomment kar do */}
        {/* <NavLink to="/admin/orders" className={linkClass} onClick={closeOnMobile}>Orders</NavLink> */}
        {/* <NavLink to="/admin/payments" className={linkClass} onClick={closeOnMobile}>Payments</NavLink> */}
        {/* <NavLink to="/admin/categories" className={linkClass} onClick={closeOnMobile}>Categories</NavLink> */}
      </aside>
    </>
  );
}

export default AdminSidebar;