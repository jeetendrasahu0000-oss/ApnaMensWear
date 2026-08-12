import styles from "./AdminSidebar.module.css";

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  setActivePage,
}) {
  const handleClick = (page) => {
    setActivePage(page);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

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

        <button onClick={() => handleClick("sales")}>
          Sales Report
        </button>

        <button onClick={() => handleClick("orders")}>
          Orders
        </button>

        <button onClick={() => handleClick("payments")}>
          Payments
        </button>

        <button onClick={() => handleClick("users")}>
          Users
        </button>

        <button onClick={() => handleClick("products")}>
          Products
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;



