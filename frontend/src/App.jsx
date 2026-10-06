import './App.css'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import Layout from './Layouts/Layout'
import About from './Shared/Pages/About/About'
import Home from './Shared/Pages/Home/Home'
import ContactUs from './Shared/Pages/ContactUs/ContactUs';
import SignupLogin from './Features/Auth/SignupLogin';
import AdminDashboard from './Shared/Pages/AdminModule/AdminDashbord';
import './Api/ApiIntersceptor'
import ProductDetailes from './Shared/components/Products/ProductDetailes';
import FilteredProducts from './Shared/components/Products/FilteredProduct/FilteredProduct';
import GetTopRetedProducts from './Shared/components/Products/GetTopRatedProducts/GetTopRetedProducts';
import GetRelatedProducts from './Shared/components/Products/GetRelatedProducts/GetRelatedProducts';
import ScrollToTop from './Shared/components/ScrollToTop/ScrollToTop';
import CategoryNavbar from './Shared/components/CategoryNavBar/CategoryNavBar';
import MyOrder from './Shared/components/Order/MyOrder';
import ViewCartProduct from './Shared/components/CartComponents/ViewCartProduct';

// NAYE PAGES
import NotFound from './Shared/Pages/NotFound/NotFound';
import Wishlist from './Shared/Pages/Wishlist/Wishlist';
import Account from './Shared/Pages/Account/Account';
import ShippingPolicy from './Shared/Pages/Policies/ShippingPolicy';
import ReturnPolicy from './Shared/Pages/Policies/ReturnPolicy';
import PrivacyPolicy from './Shared/Pages/Policies/PrivacyPolicy';
import Terms from './Shared/Pages/Policies/Terms';
import FAQ from './Shared/Pages/Policies/FAQ';
import SizeGuide from './Shared/Pages/Policies/SizeGuide';

// NAYE IMPORTS
import { AuthProvider } from './context/AuthContext';
import { setNavigate } from './Api/navigation';
import ProtectedRoute from './Shared/components/ProtectedRoute/ProtectedRoute';


function AppRoutes() {
  const navigate = useNavigate()

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
        {/* ================= MAIN LAYOUT ================= */}
        <Route element={<Layout />}>
          {/* ---- Home ---- */}
          <Route path='/' element={<Home />} />

          {/* ---- Static Info Pages ---- */}
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />

          {/* ---- Auth Routes ---- */}
          <Route path='/login' element={<SignupLogin close={OnClose} initialMode="login" />} />
          <Route path='/signup' element={<SignupLogin close={OnClose} initialMode="signup" />} />

          {/* ---- Cart (public, but user-specific) ---- */}
          <Route path='/cart' element={<ViewCartProduct onClose={OnClose} />} />

          {/* ---- Wishlist (protected) ---- */}
          <Route
            path='/wishlist'
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* ---- Account (protected) ---- */}
          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* ---- Orders (protected) ---- */}
          <Route
            path='/order'
            element={
              <ProtectedRoute>
                <MyOrder />
              </ProtectedRoute>
            }
          />

          {/* ---- Product Details ---- */}
          <Route
            path='/product/:slug'
            element={
              <>
                <ProductDetailes />
                <GetRelatedProducts />
                <CategoryNavbar />
                <GetTopRetedProducts />
              </>
            }
          />

          {/* ---- Category filter & search ---- */}
          <Route path='/filtered/:category' element={<FilteredProducts />} />

          {/* ---- Quick routes (map to filtered) ---- */}
          <Route path='/new-arrivals' element={<Navigate to="/filtered/all?sort=newest" replace />} />
          <Route path='/sale' element={<Navigate to="/filtered/all?sort=priceAsc" replace />} />
          <Route path='/best-sellers' element={<Navigate to="/filtered/all?sort=rating" replace />} />

          {/* ---- Policy Pages (SEO) ---- */}
          <Route path='/shipping-policy' element={<ShippingPolicy />} />
          <Route path='/return-policy' element={<ReturnPolicy />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/size-guide' element={<SizeGuide />} />

          {/* ---- 404 — must be LAST inside layout ---- */}
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* ================= ADMIN (own layout) ================= */}
        <Route path='/admin/*' element={<AdminDashboard />} />
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