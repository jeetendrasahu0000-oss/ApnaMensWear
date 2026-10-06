import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Account.module.css";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {user?.firstName?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p>{user?.email}</p>
          <p>{user?.phone}</p>
        </div>
      </header>

      <div className={styles.grid}>
        <button onClick={() => navigate("/order")} className={styles.card}>
          📦 My Orders
        </button>
        <button onClick={() => navigate("/wishlist")} className={styles.card}>
          ❤️ Wishlist
        </button>
        <button onClick={() => navigate("/cart")} className={styles.card}>
          🛒 My Cart
        </button>
        <button onClick={() => navigate("/contact")} className={styles.card}>
          📞 Support
        </button>
      </div>

      <button onClick={handleLogout} className={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
};

export default Account;