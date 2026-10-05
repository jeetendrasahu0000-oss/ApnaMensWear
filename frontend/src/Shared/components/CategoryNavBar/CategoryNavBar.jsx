// CategoryNavBar.jsx
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./CategoryNavBar.module.css";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GetCategoryCards } from "../../../StataicData/StaticData";

const categories = GetCategoryCards();

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

  const handleCategoryClick = (categoryValue) => {
    navigate(`/filtered/${encodeURIComponent(categoryValue)}`);
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
          {categories.map((category) => (
            <div
              key={category.name}
              className={styles.category}
              onClick={() => handleCategoryClick(category.value)}
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