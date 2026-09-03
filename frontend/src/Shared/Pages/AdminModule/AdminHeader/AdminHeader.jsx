

import {
  Menu,
  Search,
  Bell,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import styles from "./AdminHeader.module.css";

function AdminHeader({ toggleSidebar }) {
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={toggleSidebar}
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className={styles.title}>Admin Dashboard</h2>
          <p className={styles.subtitle}>
            Welcome back, Apna Mens Wear 👋
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products, orders..."
          />
        </div>

        <div className={styles.date}>
          <CalendarDays size={16} />
          <span>{today}</span>
        </div>

        <button className={styles.notification}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <div className={styles.profile}>
          <img
            src="https://i.pinimg.com/736x/f9/6a/f0/f96af0d61f141448f81cddfa4d2775dc.jpg"
            alt="admin"
          />
          <div>
            <h4>Apna Mens Wear</h4>
            <p>Administrator</p>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

