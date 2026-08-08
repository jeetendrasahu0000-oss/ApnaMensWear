import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection';
import SignupLogin from '../../../Features/Auth/SignupLogin';
import GetTopRetedProducts from '../../components/Products/GetTopRatedProducts/GetTopRetedProducts';
import CategoryWiseProducts from '../../components/Products/CategoryWiseProducts/CategoryWiseProducts';
import AllCategoryProduct from '../../components/Products/CategoryWiseProducts/AllCategoryProduct';
import HomePageBanner1 from '../../components/Banner/HomePageBanner1';
import CategoryNavbar from '../../components/CategoryNavBar/CategoryNavBar';

const Home = () => {
  return (
    <div>
        <HeroSection></HeroSection>
        <CategoryNavbar></CategoryNavbar>
        <GetTopRetedProducts></GetTopRetedProducts>
        <HomePageBanner1></HomePageBanner1>
        <AllCategoryProduct></AllCategoryProduct>
        
    </div>
  )
}

export default Home;


