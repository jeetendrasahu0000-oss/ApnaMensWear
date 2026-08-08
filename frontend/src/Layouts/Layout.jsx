import { Outlet } from "react-router-dom";
import Header from "../Shared/components/Header/Header";
import Footer from "../Shared/components/Footer/Footer";


const Layout = () => {
  return (
    <>
      <Header/>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default Layout;