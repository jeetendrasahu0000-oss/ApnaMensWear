// Header.jsx
import { useState, useEffect, useRef } from "react";
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
  FiHeart,
  FiPackage,
  FiSettings,
} from "react-icons/fi";

import { BsCart3, BsBoxSeam } from "react-icons/bs";

import SignupLogin from "../../../Features/Auth/SignupLogin";
import ViewCartProduct from "../CartComponents/ViewCartProduct";
import { fetchCategories } from "../../../Api/categories";
import SearchBar from "./SearchBar";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navigate = useNavigate();
  const accountMenuRef = useRef(null);

  const { isLoggedIn, user, logout } = useAuth();

  const onCloseForm = () => setIsFormOpen(false);

  // ---------------- Logout ----------------
  const handleLogout = () => {
    logout();
    // localStorage se user bhi clear karo
    localStorage.removeItem("user");
    setMenuOpen(false);
    setAccountMenuOpen(false);
    navigate("/");
  };

  // ---------------- Body scroll lock when drawer/cart open ----------------
  useEffect(() => {
    const shouldLock = menuOpen || isCartOpen;
    document.body.style.overflow = shouldLock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, isCartOpen]);

  // ---------------- Sticky header shadow on scroll ----------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---------------- Close account dropdown when clicking outside ----------------
  useEffect(() => {
    if (!accountMenuOpen) return;

    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  // ---------------- Load categories ----------------
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
  // CATEGORY EMOJIS
  // =====================================================
  const categoryEmojis = {
    Shirt: "👔", Shirts: "👔",
    "T-Shirt": "👕", "T-Shirts": "👕",
    Polo: "🏌️", "Polo Shirts": "🏌️",
    "Dress Shirts": "👔", "Formal Shirts": "👔", "Casual Shirts": "👕",
    Hoodie: "🧥", Hoodies: "🧥",
    Sweatshirt: "🧶", Sweatshirts: "🧶",
    Sweater: "🧶", Sweaters: "🧶",
    Jacket: "🧥", Jackets: "🧥",
    Blazer: "🤵", Blazers: "🤵", Suits: "🤵", Suit: "🤵", Tuxedo: "🤵",
    Vest: "🦺", Vests: "🦺", Waistcoat: "🦺",
    "Winter Wear": "🧣", Coats: "🧥",
    Jeans: "👖", Trouser: "👖", Trousers: "👖",
    Pants: "👖", Chinos: "👖", Cargo: "👖", "Cargo Pants": "👖",
    Shorts: "🩳", Jogger: "🏃", Joggers: "🏃",
    "Track Pants": "🏃", Trackpants: "🏃",
    Kurta: "🥻", Kurtas: "🥻", Ethnic: "🥻",
    Shoe: "👟", Shoes: "👟", Sneaker: "👟", Sneakers: "👟",
    "Sports Shoes": "👟", "Running Shoes": "👟", "Casual Shoes": "👟",
    Formal: "👞", Formals: "👞", "Formal Shoes": "👞",
    Oxford: "👞", "Oxford Shoes": "👞",
    Loafer: "👞", Loafers: "👞", Derby: "👞",
    Boot: "🥾", Boots: "🥾",
    Sandals: "🩴", "Flip Flops": "🩴", Slippers: "🩴",
    Accessories: "🎒",
    Watch: "⌚", Watches: "⌚",
    Bag: "👜", Bags: "👜",
    Backpack: "🎒", Backpacks: "🎒",
    Wallet: "👛", Wallets: "👛",
    Belt: "🥋", Belts: "🥋",
    Tie: "👔", Ties: "👔", "Bow Tie": "🎀", Bowtie: "🎀",
    Cap: "🧢", Caps: "🧢", Hat: "🎩", Hats: "🎩",
    Sunglasses: "🕶️", Sunglass: "🕶️",
    Gloves: "🧤", Scarf: "🧣", Scarves: "🧣",
    Socks: "🧦", Underwear: "🩲",
    Sleepwear: "🛌", Swimwear: "🏊", Activewear: "🏋️",
    Cufflinks: "💎", "Pocket Square": "🧣", Suspenders: "🔗",
  };

  const getCategoryEmoji = (category) => {
    if (!category) return "🏷️";
    if (categoryEmojis[category]) return categoryEmojis[category];

    const lowerCategory = category.toLowerCase();
    for (const [key, emoji] of Object.entries(categoryEmojis)) {
      if (key.toLowerCase() === lowerCategory) return emoji;
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
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.logo} onClick={() => navigate("/")}>
          <img src="/logo.png" alt="Apna Men's Wear" className={styles.logoImg} />
        </div>

        {/* DESKTOP NAV */}
        <nav className={styles.nav}>
          <Link to="/">🏠 Home</Link>

          {categories.map((item) => (
            <Link to={`/filtered/${item}`} key={item}>
              <span className={styles.categoryEmoji}>{getCategoryEmoji(item)}</span>
              <span>{item}</span>
            </Link>
          ))}

          <Link to="/contact">📞 Contact</Link>
          <Link to="/about">👤 About Us</Link>
        </nav>

        <div className={styles.actions}>
          {/* Search */}
          <button
            className={styles.iconBtn}
            onClick={() => setShowSearch((prev) => !prev)}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          {/* Wishlist */}
          <button
            className={styles.iconBtn}
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <FiHeart />
          </button>

          {/* Account — dropdown if logged in */}
          {isLoggedIn ? (
            <div className={styles.accountWrap} ref={accountMenuRef}>
              <button
                className={styles.iconBtn}
                onClick={() => setAccountMenuOpen((p) => !p)}
                aria-label="Account menu"
                aria-expanded={accountMenuOpen}
              >
                <FiUser />
              </button>

              {accountMenuOpen && (
                <div className={styles.accountMenu}>
                  <div className={styles.accountMenuHeader}>
                    <p className={styles.accountName}>
                      Hi, {user?.firstName || "User"} 👋
                    </p>
                    <p className={styles.accountEmail}>{user?.email || ""}</p>
                  </div>

                  <button
                    className={styles.accountMenuItem}
                    onClick={() => {
                      navigate("/account");
                      setAccountMenuOpen(false);
                    }}
                  >
                    <FiSettings size={15} />
                    My Account
                  </button>

                  <button
                    className={styles.accountMenuItem}
                    onClick={() => {
                      navigate("/order");
                      setAccountMenuOpen(false);
                    }}
                  >
                    <FiPackage size={15} />
                    My Orders
                  </button>

                  <button
                    className={styles.accountMenuItem}
                    onClick={() => {
                      navigate("/wishlist");
                      setAccountMenuOpen(false);
                    }}
                  >
                    <FiHeart size={15} />
                    Wishlist
                  </button>

                  <div className={styles.accountMenuDivider} />

                  <button
                    className={`${styles.accountMenuItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <FiLogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={styles.iconBtn}
              onClick={() => setIsFormOpen(true)}
              aria-label="Account"
            >
              <FiUser />
            </button>
          )}

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

      <div
        className={`${styles.overlay} ${menuOpen ? styles.showOverlay : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.showDrawer : ""}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Apna Men's Wear" className={styles.logoImg} />
          </div>
          <button
            className={styles.drawerCloseBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <Link to="/" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
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
              style={{ animationDelay: `${index * 0.05}s` }}
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

        {/* Mobile wishlist + account */}
        <Link to="/wishlist" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
          <span className={styles.drawerLinkContent}>
            <FiHeart className={styles.drawerIcon} />
            <span>Wishlist</span>
          </span>
          <FiChevronRight className={styles.arrow} />
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/account" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.drawerLinkContent}>
                <FiUser className={styles.drawerIcon} />
                <span>My Account</span>
              </span>
              <FiChevronRight className={styles.arrow} />
            </Link>

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
          </>
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

      {/* CART MODAL */}
      {isCartOpen && <ViewCartProduct onClose={() => setIsCartOpen(false)} />}

      {/* SEARCH BAR */}
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default Header;