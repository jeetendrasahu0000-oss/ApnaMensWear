import './App.css'
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';

// Layout
import Layout from './Layouts/Layout'

// Pages
import About from './Shared/Pages/About/About'
import Home from './Shared/Pages/Home/Home'
import ContactUs from './Shared/Pages/ContactUs/ContactUs';
import SignupLogin from './Features/Auth/SignupLogin';
import AdminDashboard from './Shared/Pages/AdminModule/AdminDashbord';

// API / Interceptor
import './Api/ApiIntersceptor'
import { setNavigate } from './Api/navigation';

// Products / Cart / Orders
import ProductDetailes from './Shared/components/Products/ProductDetailes';
import FilteredProducts from './Shared/components/Products/FilteredProduct/FilteredProduct';
import GetTopRetedProducts from './Shared/components/Products/GetTopRatedProducts/GetTopRetedProducts';
import GetRelatedProducts from './Shared/components/Products/GetRelatedProducts/GetRelatedProducts';
import MyOrder from './Shared/components/Order/MyOrder';
import ViewCartProduct from './Shared/components/CartComponents/ViewCartProduct';

// Layout helpers
import ScrollToTop from './Shared/components/ScrollToTop/ScrollToTop';
import CategoryNavbar from './Shared/components/CategoryNavBar/CategoryNavBar';

// New pages
import NotFound from './Shared/Pages/NotFound/NotFound';
import Wishlist from './Shared/Pages/Wishlist/Wishlist';
import Account from './Shared/Pages/Account/Account';
import ShippingPolicy from './Shared/Pages/Policies/ShippingPolicy';
import ReturnPolicy from './Shared/Pages/Policies/ReturnPolicy';
import PrivacyPolicy from './Shared/Pages/Policies/PrivacyPolicy';
import Terms from './Shared/Pages/Policies/Terms';
import FAQ from './Shared/Pages/Policies/FAQ';
import SizeGuide from './Shared/Pages/Policies/SizeGuide';

// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Shared/components/ProtectedRoute/ProtectedRoute';


// ======================================================
// AUTH ROUTE — /login aur /signup dono isko use karte hain
// Home page background mein render hota hai, upar modal
// ======================================================
function AuthRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  const authMode = location.pathname === "/signup" ? "signup" : "login";

  // FIX: navigate(-1) ki jagah navigate("/", {replace:true})
  // Kyun? login↔signup switch karte waqt navigate(-1) galat page
  // pe le jaata tha aur modal turant band ho jaata tha.
  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <>
      <Home />
      <SignupLogin mode={authMode} onClose={handleClose} />
    </>
  );
}


// ======================================================
// MAIN APP ROUTES
// ======================================================
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
        <Route element={<Layout />}>

          {/* ---- Home ---- */}
          <Route path='/' element={<Home />} />

          {/* ---- Static Pages ---- */}
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />

          {/* ---- Cart ---- */}
          <Route path='/cart' element={<ViewCartProduct onClose={OnClose} />} />

          {/* ---- Protected routes ---- */}
          <Route
            path='/wishlist'
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
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

          {/* ---- Category / Search ---- */}
          <Route path='/filtered/:category' element={<FilteredProducts />} />

          {/* ---- Quick routes ---- */}
          <Route path='/new-arrivals' element={<Navigate to="/filtered/all?sort=newest" replace />} />
          <Route path='/sale' element={<Navigate to="/filtered/all?sort=priceAsc" replace />} />
          <Route path='/best-sellers' element={<Navigate to="/filtered/all?sort=rating" replace />} />

          {/* ---- Policy Pages ---- */}
          <Route path='/shipping-policy' element={<ShippingPolicy />} />
          <Route path='/return-policy' element={<ReturnPolicy />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/size-guide' element={<SizeGuide />} />

          {/* ================= AUTH ROUTES (MODAL) ================= */}
          <Route path='/login' element={<AuthRoute />} />
          <Route path='/signup' element={<AuthRoute />} />

          {/* ---- 404 ---- */}
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* ================= ADMIN ================= */}
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