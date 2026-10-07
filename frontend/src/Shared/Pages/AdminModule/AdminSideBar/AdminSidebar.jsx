import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiShoppingBag,
  FiCreditCard,
  FiUsers,
  FiPackage,
  FiTag,
} from "react-icons/fi";
import styles from "./AdminSidebar.module.css";

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const closeOnMobile = () => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.active : ""}`;

  const links = [
    { to: "/admin/sales", label: "Sales Report", icon: <FiBarChart2 size={17} /> },
    { to: "/admin/orders", label: "Orders", icon: <FiShoppingBag size={17} /> },
    { to: "/admin/payments", label: "Payments", icon: <FiCreditCard size={17} /> },
    { to: "/admin/products", label: "Products", icon: <FiPackage size={17} /> },
    { to: "/admin/categories", label: "Categories", icon: <FiTag size={17} /> },
    { to: "/admin/users", label: "Users", icon: <FiUsers size={17} /> },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : ""
        }`}
      >
        <h3 className={styles.logo}>Admin</h3>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={linkClass}
            onClick={closeOnMobile}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </aside>
    </>
  );
}

export default AdminSidebar;