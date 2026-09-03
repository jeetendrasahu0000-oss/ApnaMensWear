// HomePageBanner1.jsx
import React, { useEffect, useState } from "react";
import styles from "./HomePageBanner1.module.css";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiTrendingUp,
  FiStar,
  FiClock,
  FiZap,
  FiArrowRight,
  FiShoppingBag,
  FiAward,
  FiGift,
  FiLayers
} from "react-icons/fi";

const banners = [
  {
    title: "New Arrivals",
    accent: "Arrivals",
    subtitle: "Fresh styles for everyday fashion",
    tag: "Trending Now",
    tagIcon: <FiTrendingUp />,
    image:
      "https://i.pinimg.com/736x/fa/25/89/fa258975e3448fff42c0cc019eedc6d7.jpg",
    bgColor: "#0a0a0f",
  },
  {
    title: "Premium Collection",
    accent: "Collection",
    subtitle: "Designed for modern lifestyles",
    tag: "Exclusive",
    tagIcon: <FiStar />,
    image:
      "https://i.pinimg.com/736x/a2/0d/1e/a20d1e7f23c02239f27c58fdf36d33f2.jpg",
    bgColor: "#0d0d14",
  },
  {
    title: "Up To 70% Off",
    accent: "70% Off",
    subtitle: "Limited time offers on trending products",
    tag: "Sale",
    tagIcon: <FiZap />,
    image:
      "https://i.pinimg.com/736x/5e/24/e7/5e24e7a9a3232b64a5dcc4d829dd85a7.jpg",
    bgColor: "#0f0a08",
  },
  {
    title: "Winter Collection",
    accent: "Collection",
    subtitle: "Stay warm in style this season",
    tag: "New Drop",
    tagIcon: <FiClock />,
    image:
      "https://i.pinimg.com/736x/c0/00/26/c0002617c300be374c742c30d54304c5.jpg",
    bgColor: "#0a0e12",
  },
];

const renderTitle = (title, accent) => {
  if (!accent || !title.includes(accent)) return title;
  const idx = title.indexOf(accent);
  const before = title.slice(0, idx);
  const after = title.slice(idx + accent.length);
  return (
    <>
      {before}
      <em>{accent}</em>
      {after}
    </>
  );
};

const HomePageBanner1 = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setActive(index);
  const goToPrev = () => setActive((prev) => (prev - 1 + banners.length) % banners.length);
  const goToNext = () => setActive((prev) => (prev + 1) % banners.length);

  return (
    <section className={styles.banner}>
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`${styles.slide} ${active === index ? styles.active : ""}`}
          style={{ 
            backgroundImage: `url(${banner.image})`,
            backgroundColor: banner.bgColor,
          }}
        >
          <div className={styles.overlay}>
            <div className={styles.overlayGradient} />
          </div>

          <div className={styles.content}>
            <span className={styles.tag}>
              <span className={styles.tagIcon}>{banner.tagIcon}</span>
              {banner.tag}
            </span>

            <h2>{renderTitle(banner.title, banner.accent)}</h2>

            <p>{banner.subtitle}</p>
          </div>

          {/* Decorative line */}
          <div className={styles.decorativeLine} />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <FiChevronLeft />
      </button>

      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={goToNext}
        aria-label="Next slide"
      >
        <FiChevronRight />
      </button>

      {/* Slide Counter */}
      <div className={styles.slideCounter}>
        <span className={styles.counterActive}>{String(active + 1).padStart(2, '0')}</span>
        <span className={styles.counterSeparator}>/</span>
        <span className={styles.counterTotal}>{String(banners.length).padStart(2, '0')}</span>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={active === index ? styles.activeDot : styles.dot}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomePageBanner1;