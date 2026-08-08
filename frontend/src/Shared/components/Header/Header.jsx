import React, { useState } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiHome,
  FiStar,
  FiBox,
  FiGift,
  FiTag,
  FiChevronRight,
} from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";

import SignupLogin from "../../../Features/Auth/SignupLogin";
import ViewCartProduct from "../CartComponents/ViewCartProduct";



import { FiPackage } from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate()

  const OnClose =()=>{
    setIsFormOpen(false)
  }

  const navLinks = [
    { name: "HOME", icon: <FiHome /> },
    { name: "NEW ARRIVALS", icon: <FiStar /> },
    { name: "SHIRTS", icon: <FiBox /> },
    { name: "T-SHIRTS", icon: <FiBox /> },
    { name: "JEANS", icon: <FiBox /> },
    { name: "HOODIES", icon: <FiBox /> },
    { name: "JACKETS", icon: <FiBox /> },
    { name: "ACCESSORIES", icon: <FiGift /> },
    { name: "SALE", icon: <FiTag /> },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <span>🚚 Free Shipping on Orders Above ₹999</span>

        <div className={styles.topBarRight}>
          <span>COD Available</span>
          <span>|</span>
          <span>Easy 7 Days Returns</span>
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.logo} onClick={()=>{navigate('/')}}>
          <h1>Apna</h1>
          <p>MEN'S WEAR</p>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((item) => (
            <a href="/" key={item.name}>
              {item.name}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <FiSearch />
          </button>

          <button className={styles.iconBtn} onClick={()=>setIsFormOpen(true)}>
            <FiUser />
          </button>

          

          <button className={styles.iconBtn}  onClick={()=>{setIsCartOpen(true)}}>
            {/* <FiShoppingBag /> */}
            <BsCart3 />
            {/* <span className={styles.badge}></span> */}
          </button>


          <button className={styles.iconBtn} onClick={()=>{navigate('/order')}}>
            <BsBoxSeam />
          </button>

        </div>
      </header>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.showOverlay : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${
          menuOpen ? styles.showDrawer : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <h3>Menu</h3>
        </div>

        {navLinks.map((item, index) => (
          <a
            href="/"
            key={item.name}
            className={styles.drawerLink}
            style={{
              animationDelay: `${index * 0.08}s`,
            }}
          >
            <div className={styles.linkLeft}>
              <span className={styles.linkIcon}>{item.icon}</span>

              <span>{item.name}</span>
            </div>

            <FiChevronRight className={styles.arrow} />
          </a>
        ))}
      </div>

      {isFormOpen && <SignupLogin   close={OnClose}/>}
      {isCartOpen && <ViewCartProduct onClose={()=>{setIsCartOpen(false)}}></ViewCartProduct>}

    </>
  );
};

export default Header;
