// import { useState } from "react";
// import styles from "./AdminDashbord.module.css";

// import AdminHeader from "./AdminHeader/AdminHeader";
// import AdminSidebar  from "./AdminSideBar/AdminSidebar";
// import ProductDashboard from "./ProductDashbord/ProductDashbord";
// import SalesReport from "./SalesReport/SalesReport";
// import OrderDashbord from "./OrderDashbord/OrderDashbord";
// import UserDashbord from "./UserDashbord/UserDashbord";





// function AdminDashbord(){
//     return(
//     <div>
//         <AdminHeader></AdminHeader>
//         <AdminSidebar></AdminSidebar>
//         <SalesReport></SalesReport>
//         <OrderDashbord></OrderDashbord>
//         <UserDashbord></UserDashbord>
//         <ProductDashboard></ProductDashboard>
//     </div>
//     )
// }
// export default AdminDashbord;





import { useState } from "react";
import styles from "./AdminDashbord.module.css";

import AdminHeader from "./AdminHeader/AdminHeader";
import AdminSidebar from "./AdminSideBar/AdminSidebar";

import SalesReport from "./SalesReport/SalesReport";
import OrderDashbord from "./OrderDashbord/OrderDashbord";
import UserDashbord from "./UserDashbord/UserDashbord";
import ProductDashboard from "./ProductDashbord/ProductDashbord";


function AdminDashbord() {
    
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("products");

  const renderPage = () => {
    switch (activePage) {
      case "sales":
        return <SalesReport />;

      case "orders":
        return <OrderDashbord />;

      case "users":
        return <UserDashbord />;

      case "products":
        return <ProductDashboard />;

      default:
        return <SalesReport />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <AdminHeader
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={styles.mainContainer}>
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
        />

        <main className={styles.content}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashbord;

