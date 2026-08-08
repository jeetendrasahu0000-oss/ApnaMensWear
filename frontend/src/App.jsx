import './App.css'
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from 'react';

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



function App() {
    const navigate = useNavigate()
  
    const OnClose =()=>{
      navigate('/')
    }


  return (
    <>
    <ScrollToTop />
    <Routes>
        <Route element={<Layout />}>
        <Route path='/' element={<Home />} ></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<ContactUs/>}></Route>
        <Route path ='/signup' element ={<SignupLogin close={OnClose}/>} ></Route>
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
    {/* </ScrollToTop> */}
    </>
  )
}

export default App

