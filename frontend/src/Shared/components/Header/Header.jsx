// Header.jsx
import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiUser,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";

import { BsCart3, BsBoxSeam } from "react-icons/bs";

import SignupLogin from "../../../Features/Auth/SignupLogin";
import ViewCartProduct from "../CartComponents/ViewCartProduct";

import { GetCategories } from "../../../StataicData/StaticData";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const categories = GetCategories();

  const onCloseForm = () => setIsFormOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const announcements = [
    "FREE SHIPPING ON ORDERS ABOVE ₹999",
    "NEW ARRIVALS — SHOP THE DROP",
    "USE CODE 'APNA10' FOR 10% OFF",
    "SUMMER SALE — UP TO 40% OFF",
  ];

  // =====================================================
  // CATEGORY EMOJIS - UNIQUE FOR EACH CATEGORY
  // =====================================================

  const categoryEmojis = {
    // Tops
    "Shirt": "👔",
    "Shirts": "👔",
    "T-Shirt": "👕",
    "T-Shirts": "👕",
    "Polo": "🏌️",
    "Polo Shirts": "🏌️",
    "Dress Shirts": "👔",
    "Formal Shirts": "👔",
    "Casual Shirts": "👕",
    
    // Hoodies & Sweaters
    "Hoodie": "🧥",
    "Hoodies": "🧥",
    "Sweatshirt": "🧶",
    "Sweatshirts": "🧶",
    "Sweater": "🧶",
    "Sweaters": "🧶",
    
    // Jackets & Outerwear
    "Jacket": "🧥",
    "Jackets": "🧥",
    "Blazer": "🤵",
    "Blazers": "🤵",
    "Suits": "🤵",
    "Suit": "🤵",
    "Tuxedo": "🤵",
    "Vest": "🦺",
    "Vests": "🦺",
    "Waistcoat": "🦺",
    "Winter Wear": "🧣",
    "Coats": "🧥",
    
    // Bottoms
    "Jeans": "👖",
    "Jens": "👖",
    "Trouser": "👖",
    "Trousers": "👖",
    "Pants": "👖",
    "Chinos": "👖",
    "Cargo": "👖",
    "Cargo Pants": "👖",
    "Shorts": "🩳",
    "Jogger": "🏃",
    "Joggers": "🏃",
    "Track Pants": "🏃",
    "Trackpants": "🏃",
    
    // Kurtas & Ethnic
    "Kurta": "🥻",
    "Kurtas": "🥻",
    "Ethnic": "🥻",
    
    // Footwear - Sports
    "Shoe": "👟",
    "Shoes": "👟",
    "Sneaker": "👟",
    "Sneakers": "👟",
    "Sports Shoes": "👟",
    "Running Shoes": "👟",
    "Casual Shoes": "👟",
    
    // Footwear - Formal
    "Formal": "👞",
    "Formals": "👞",
    "Formal Shoes": "👞",
    "Oxford": "👞",
    "Oxford Shoes": "👞",
    "Loafer": "👞",
    "Loafers": "👞",
    "Derby": "👞",
    
    // Footwear - Other
    "Boot": "🥾",
    "Boots": "🥾",
    "Sandals": "🩴",
    "Flip Flops": "🩴",
    "Slippers": "🩴",
    
    // Accessories
    "Accessories": "🎒",
    "Watch": "⌚",
    "Watches": "⌚",
    "Bag": "👜",
    "Bags": "👜",
    "Backpack": "🎒",
    "Backpacks": "🎒",
    "Wallet": "👛",
    "Wallets": "👛",
    "Belt": "🥋",
    "Belts": "🥋",
    "Tie": "👔",
    "Ties": "👔",
    "Bow Tie": "🎀",
    "Bowtie": "🎀",
    "Cap": "🧢",
    "Caps": "🧢",
    "Hat": "🎩",
    "Hats": "🎩",
    "Sunglasses": "🕶️",
    "Sunglass": "🕶️",
    "Gloves": "🧤",
    "Scarf": "🧣",
    "Scarves": "🧣",
    "Socks": "🧦",
    "Underwear": "🩲",
    "Sleepwear": "🛌",
    "Swimwear": "🏊",
    "Activewear": "🏋️",
    "Cufflinks": "💎",
    "Pocket Square": "🧣",
    "Suspenders": "🔗",
  };

  // =====================================================
  // GET CATEGORY EMOJI - WITH CASE INSENSITIVE MATCHING
  // =====================================================

  const getCategoryEmoji = (category) => {
    if (!category) return "🏷️";
    
    // Direct match
    if (categoryEmojis[category]) {
      return categoryEmojis[category];
    }
    
    // Case insensitive match
    const lowerCategory = category.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (key.toLowerCase() === lowerCategory) {
        return emoji;
      }
    }
    
    // Partial match - check if category contains any keyword
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      const lowerKey = key.toLowerCase();
      if (lowerCategory.includes(lowerKey) || lowerKey.includes(lowerCategory)) {
        return emoji;
      }
    }
    
    // Default fallback
    return "🏷️";
  };

  return (
    <>
      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div className={styles.announcementBar}>
        <div className={styles.announcementTrack}>
          {[...announcements, ...announcements].map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </div>
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={`${styles.header} ${
          scrolled ? styles.headerScrolled : ""
        }`}
      >
        {/* Mobile Menu Button */}

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}

        <div className={styles.logo} onClick={() => navigate("/")}>
          <h1>Apna</h1>
          <p>MEN&apos;S WEAR</p>
        </div>

        {/* =====================================================
            DESKTOP NAV
        ===================================================== */}

        <nav className={styles.nav}>
          <a href="/">
            🏠 Home
          </a>

          {categories.map((item) => (
            <a
              href={`/filtered/${item}`}
              key={item}
            >
              <span className={styles.categoryEmoji}>
                {getCategoryEmoji(item)}
              </span>

              <span>{item}</span>
            </a>
          ))}
        </nav>

        {/* =====================================================
            HEADER ACTIONS
        ===================================================== */}

        <div className={styles.actions}>
          {/* Account */}

          <button
            className={styles.iconBtn}
            onClick={() => setIsFormOpen(true)}
            aria-label="Account"
          >
            <FiUser />
          </button>

          {/* Cart */}

          <button
            className={styles.iconBtn}
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <BsCart3 />
          </button>

          {/* Orders */}

          <button
            className={styles.iconBtn}
            onClick={() => navigate("/order")}
            aria-label="Orders"
          >
            <BsBoxSeam />
          </button>
        </div>
      </header>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        className={`${styles.overlay} ${
          menuOpen ? styles.showOverlay : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <div
        className={`${styles.mobileDrawer} ${
          menuOpen ? styles.showDrawer : ""
        }`}
      >
        {/* Drawer Header */}

        <div className={styles.drawerHeader}>
          <div className={styles.logo}>
            <h1>Apna</h1>
            <p>MEN&apos;S WEAR</p>
          </div>

          <button
            className={styles.drawerCloseBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        {/* =====================================================
            HOME
        ===================================================== */}

        <a
          href="/"
          className={styles.drawerLink}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.drawerLinkContent}>
            <FiHome className={styles.drawerIcon} />

            <span>Home</span>
          </span>

          <FiChevronRight className={styles.arrow} />
        </a>

        {/* =====================================================
            CATEGORIES - WITH UNIQUE EMOJIS
        ===================================================== */}

        {categories.map((item, index) => {
          const emoji = getCategoryEmoji(item);
          
          return (
            <a
              href={`/filtered/${item}`}
              key={item}
              className={styles.drawerLink}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.drawerLinkContent}>
                {/* UNIQUE CATEGORY EMOJI */}

                <span className={styles.drawerEmoji}>
                  {emoji}
                </span>

                {/* CATEGORY NAME */}

                <span>{item}</span>
              </span>

              <FiChevronRight className={styles.arrow} />
            </a>
          );
        })}
      </div>

      {/* =====================================================
          LOGIN MODAL
      ===================================================== */}

      {isFormOpen && <SignupLogin close={onCloseForm} />}

      {/* =====================================================
          CART
      ===================================================== */}

      {isCartOpen && (
        <ViewCartProduct
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
};

export default Header;