import './App.css'
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import Layout from './Layouts/Layout'
import About from './Shared/Pages/About/About'
import Home from './Shared/Pages/Home/Home'
import ContactUs from './Shared/Pages/ContactUs/ContactUs';
import SignupLogin from './Features/Auth/SignupLogin';
import AdminDashboard from './Shared/Pages/AdminModule/AdminDashbord';
import './Api/ApiIntersceptor'
import ProductDelete from './Shared/Pages/AdminModule/ProductDashbord/ProductDelete';
import ProductDetailes from './Shared/components/Products/ProductDetailes';
import CategoryWiseProducts from './Shared/components/Products/CategoryWiseProducts/CategoryWiseProducts';
import FilteredProducts from './Shared/components/Products/FilteredProduct/FilteredProduct';
import GetTopRetedProducts from './Shared/components/Products/GetTopRatedProducts/GetTopRetedProducts';
import GetRelatedProducts from './Shared/components/Products/GetRelatedProducts/GetRelatedProducts';
import ScrollToTop from './Shared/components/ScrollToTop/ScrollToTop';
import CategoryNavbar from './Shared/components/CategoryNavBar/CategoryNavBar';
import MyOrder from './Shared/components/Order/MyOrder';
import ViewCartProduct from './Shared/components/CartComponents/ViewCartProduct';

// NAYE IMPORTS
import { AuthProvider } from './context/AuthContext';
import { setNavigate } from './Api/navigation';


function AppRoutes() {
  const navigate = useNavigate()

  // Interceptor ko navigate function de dete hain taaki wo bhi
  // SPA-style navigate kar sake (hard reload nahi)
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const OnClose = () => {
    navigate('/')
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} ></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/contact' element={<ContactUs />}></Route>

          {/* Cart ka apna route bhi ab hai - direct link/refresh par bhi khulega */}
          <Route path='/cart' element={<ViewCartProduct onClose={OnClose} />} ></Route>

          {/* Login aur Signup ab alag-alag routes hain, same component,
              bas initialMode alag pass kar rahe hain */}
          <Route path='/login' element={<SignupLogin close={OnClose} initialMode="login" />} ></Route>
          <Route path='/signup' element={<SignupLogin close={OnClose} initialMode="signup" />} ></Route>

         

          <Route path='/product/:slug' element={<>
            <ProductDetailes />
            <GetRelatedProducts></GetRelatedProducts>
            <CategoryNavbar></CategoryNavbar>
            <GetTopRetedProducts></GetTopRetedProducts>
          </>
          } ></Route>
          <Route path='/filtered/:category' element={<FilteredProducts />}></Route>
          <Route path='/order' element={<MyOrder></MyOrder>} ></Route>
        </Route>

        <Route path='/admin-dashbord' element={<AdminDashboard></AdminDashboard>} ></Route>
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App