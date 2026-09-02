// CategoryNavBar.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "./CategoryNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Clothing categories
const categories = [
  {
    name: "Jackets",
    image: "https://i.pinimg.com/1200x/00/cc/6f/00cc6ff38505b285768a9186e1535c71.jpg",
  },
  {
    name: "Hoodies",
    image: "https://i.pinimg.com/736x/78/20/b5/7820b5a56263da0b711ddff972bd4533.jpg",
  },
  {
    name: "Jeans",
    image: "https://i.pinimg.com/736x/32/c5/cc/32c5ccc87b7f640ae12d5a40005c5557.jpg",
  },
  {
    name: "Shirts",
    image: "https://i.pinimg.com/736x/44/e6/7b/44e67b93fe192737d556aa8192c9139d.jpg",
  },
  {
    name: "T-Shirts",
    image: "https://i.pinimg.com/736x/88/4b/3a/884b3ad72513070241246775b3d5e1d3.jpg",
  },
  {
    name: "Formal",
    image: "https://i.pinimg.com/736x/e0/7b/b9/e07bb9963ff5b7191c438117d411f284.jpg",
  },
  {
    name: "Cargo",
    image: "https://i.pinimg.com/1200x/0b/62/cc/0b62cc3022ef9f57fe4a9c45df3307d4.jpg",
  },
];

const CategoryNavbar = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const threshold = 4;
    setAtStart(el.scrollLeft <= threshold);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(el);

    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
      resizeObserver.disconnect();
    };
  }, [updateEdges]);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.category}`);
    const step = card ? card.offsetWidth + 22 : 200;
    const target = el.scrollLeft + dir * step * 2.5;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleCategoryClick = (catName) => {
    navigate(`/filtered/${catName}`);
  };

  return (
    <section className={styles.section}>
      <div className={styles.headingWrap}>
        <span className={styles.eyebrow}>✦ Premium Collection</span>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>
          Explore our curated collection of premium clothing for the modern man.
        </p>
      </div>

      <div className={styles.scrollArea}>
        <button
          className={`${styles.navBtn} ${styles.navBtnLeft} ${
            atStart ? styles.navBtnHidden : ""
          }`}
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>

        <div className={styles.wrapper} ref={trackRef}>
          {categories.map((category, index) => (
            <div
              key={category.name}
              className={styles.category}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className={styles.imageBox}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </div>
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnRight} ${
            atEnd ? styles.navBtnHidden : ""
          }`}
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>
      </div>
    </section>
  );
};

export default CategoryNavbar;