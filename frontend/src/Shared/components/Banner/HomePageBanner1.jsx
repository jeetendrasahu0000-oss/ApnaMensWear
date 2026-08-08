import React, { useEffect, useState } from "react";
import styles from "./HomePageBanner1.module.css";

const banners = [
  {
    title: "New Arrivals",
    subtitle: "Fresh styles for everyday fashion",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600",
  },
  {
    title: "Premium Collection",
    subtitle: "Designed for modern lifestyles",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600",
  },
  {
    title: "Up To 70% Off",
    subtitle: "Limited time offers on trending products",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600",
  },
];

const HomePageBanner1 = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.banner}>
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`${styles.slide} ${active === index ? styles.active : ""}`}
          style={{
            backgroundImage: `url(${banner.image})`,
          }}
        >
          <div className={styles.overlay} />

          <div className={styles.content}>
            <span className={styles.tag}>TRENDING NOW</span>

            <h2>{banner.title}</h2>

            <p>{banner.subtitle}</p>

            <button>Shop Now</button>
          </div>
        </div>
      ))}

      <div className={styles.dots}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={active === index ? styles.activeDot : styles.dot}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HomePageBanner1;
