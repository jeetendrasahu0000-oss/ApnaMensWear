// Header.jsx
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate, Link } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiUser,
  FiChevronRight,
  FiHome,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";

import { BsCart3, BsBoxSeam } from "react-icons/bs";

import SignupLogin from "../../../Features/Auth/SignupLogin";
import ViewCartProduct from "../CartComponents/ViewCartProduct";
import { fetchCategories } from "../../../Api/categories";
import SearchBar from "./SearchBar";

// NAYA IMPORT
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // NAYA: global auth state
  const { isLoggedIn, user, logout } = useAuth();

  const onCloseForm = () => setIsFormOpen(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

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

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((loadedCategories) => {
        if (active) {
          setCategories(loadedCategories.map(({ name }) => name));
        }
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });

    return () => {
      active = false;
    };
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
    "Shirt": "👔",
    "Shirts": "👔",
    "T-Shirt": "👕",
    "T-Shirts": "👕",
    "Polo": "🏌️",
    "Polo Shirts": "🏌️",
    "Dress Shirts": "👔",
    "Formal Shirts": "👔",
    "Casual Shirts": "👕",
    "Hoodie": "🧥",
    "Hoodies": "🧥",
    "Sweatshirt": "🧶",
    "Sweatshirts": "🧶",
    "Sweater": "🧶",
    "Sweaters": "🧶",
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
    "Jeans": "👖",
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
    "Kurta": "🥻",
    "Kurtas": "🥻",
    "Ethnic": "🥻",
    "Shoe": "👟",
    "Shoes": "👟",
    "Sneaker": "👟",
    "Sneakers": "👟",
    "Sports Shoes": "👟",
    "Running Shoes": "👟",
    "Casual Shoes": "👟",
    "Formal": "👞",
    "Formals": "👞",
    "Formal Shoes": "👞",
    "Oxford": "👞",
    "Oxford Shoes": "👞",
    "Loafer": "👞",
    "Loafers": "👞",
    "Derby": "👞",
    "Boot": "🥾",
    "Boots": "🥾",
    "Sandals": "🩴",
    "Flip Flops": "🩴",
    "Slippers": "🩴",
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

  const getCategoryEmoji = (category) => {
    if (!category) return "🏷️";

    if (categoryEmojis[category]) {
      return categoryEmojis[category];
    }

    const lowerCategory = category.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (key.toLowerCase() === lowerCategory) {
        return emoji;
      }
    }

    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      const lowerKey = key.toLowerCase();
      if (lowerCategory.includes(lowerKey) || lowerKey.includes(lowerCategory)) {
        return emoji;
      }
    }

    return "🏷️";
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      <div className={styles.announcementBar}>
        <div className={styles.announcementTrack}>
          {[...announcements, ...announcements].map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header
        className={`${styles.header} ${
          scrolled ? styles.headerScrolled : ""
        }`}
      >
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.logo} onClick={() => navigate("/")}>
          <img
            src="/logo.png"
            alt="Apna Men's Wear"
            className={styles.logoImg}
          />
        </div>

        {/* DESKTOP NAV - FIX: <a href> -> <Link to> (full page reload band ho gaya) */}
        <nav className={styles.nav}>
          <Link to="/">🏠 Home</Link>

          {categories.map((item) => (
            <Link to={`/filtered/${item}`} key={item}>
              <span className={styles.categoryEmoji}>
                {getCategoryEmoji(item)}
              </span>
              <span>{item}</span>
            </Link>
          ))}

          <Link to="/contact">📞 Contact</Link>
          <Link to="/about">👤 About Us</Link>
        </nav>

        <div className={styles.actions}>

          <button
            className={styles.iconBtn}
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* Account - FIX: login hone ke baad ye button gayab ho jaata hai,
              uski jagah logout button aa jaata hai */}
          {isLoggedIn ? (
            <button
              className={styles.iconBtn}
              onClick={handleLogout}
              aria-label={`Logout${user?.firstName ? ` (${user.firstName})` : ""}`}
              title={user?.firstName ? `Logout (${user.firstName})` : "Logout"}
            >
              <FiLogOut />
            </button>
          ) : (
            <button
              className={styles.iconBtn}
              onClick={() => setIsFormOpen(true)}
              aria-label="Account"
            >
              <FiUser />
            </button>
          )}

          <button
            className={styles.iconBtn}
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <BsCart3 />
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => navigate("/order")}
            aria-label="Orders"
          >
            <BsBoxSeam />
          </button>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${
          menuOpen ? styles.showOverlay : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE DRAWER - FIX: <a href> -> <Link to> */}
      <div
        className={`${styles.mobileDrawer} ${
          menuOpen ? styles.showDrawer : ""
        }`}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.logo}>
            <img
              src="/logo.png"
              alt="Apna Men's Wear"
              className={styles.logoImg}
            />
          </div>

          <button
            className={styles.drawerCloseBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <Link
          to="/"
          className={styles.drawerLink}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.drawerLinkContent}>
            <FiHome className={styles.drawerIcon} />
            <span>Home</span>
          </span>
          <FiChevronRight className={styles.arrow} />
        </Link>

        {categories.map((item, index) => {
          const emoji = getCategoryEmoji(item);

          return (
            <Link
              to={`/filtered/${item}`}
              key={item}
              className={styles.drawerLink}
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.drawerLinkContent}>
                <span className={styles.drawerEmoji}>{emoji}</span>
                <span>{item}</span>
              </span>
              <FiChevronRight className={styles.arrow} />
            </Link>
          );
        })}

        <Link to="/contact" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
          📞 Contact
        </Link>
        <Link to="/about" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
          👤 About Us
        </Link>

        {/* Mobile drawer mein bhi login/logout ka same behaviour */}
        {isLoggedIn ? (
          <button
            className={styles.drawerLink}
            onClick={handleLogout}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            <span className={styles.drawerLinkContent}>
              <FiLogOut className={styles.drawerIcon} />
              <span>Logout</span>
            </span>
          </button>
        ) : (
          <button
            className={styles.drawerLink}
            onClick={() => {
              setMenuOpen(false);
              setIsFormOpen(true);
            }}
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            <span className={styles.drawerLinkContent}>
              <FiUser className={styles.drawerIcon} />
              <span>Login / Signup</span>
            </span>
          </button>
        )}
      </div>

      {/* LOGIN MODAL */}
      {isFormOpen && <SignupLogin close={onCloseForm} />}

      {/* CART */}
      {isCartOpen && (
        <ViewCartProduct onClose={() => setIsCartOpen(false)} />
      )}

      {/* SEARCH BAR */}
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default Header;