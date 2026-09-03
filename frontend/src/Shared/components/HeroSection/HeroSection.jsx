import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import styles from "./HeroSection.module.css";

const slides = [
  {
    title: "Premium Style For Modern Men",
    desc: "Timeless outfits that blend confidence and comfort – for every occasion.",
    button: "Shop Collection",
    image:
      "https://i.pinimg.com/736x/f9/6a/f0/f96af0d61f141448f81cddfa4d2775dc.jpg",
    tag: "New Arrivals",
  },
  {
    title: "Winter Collection 2026",
    desc: "Upgrade your wardrobe with premium jackets and layered casual wear.",
    button: "Explore Now",
    image:
      "https://i.pinimg.com/736x/8e/7a/aa/8e7aaa281f5c892149fcdd0eae6f9c87.jpg",
    tag: "Seasonal Picks",
  },
  {
    title: "Classic Looks, Modern Fit",
    desc: "Designed for men who value effortless style and superior craftsmanship.",
    button: "View Products",
    image:
      "https://i.pinimg.com/736x/26/47/f2/2647f21911b94fd48220cf6c69c91e59.jpg"
  },
  {
    title: "Summer Breeze Collection",
    desc: "Lightweight fabrics and breathable designs for the perfect summer look.",
    button: "Shop Summer",
    image:
      "https://i.pinimg.com/736x/0a/e6/3c/0ae63cc4d304a80e4dfa1ae75c106187.jpg",
    tag: "Summer 2026",
  },
  {
    title: "Urban Streetwear",
    desc: "Bold styles, relaxed fits – street fashion redefined for the modern man.",
    button: "Explore Streetwear",
    image:
      "https://i.pinimg.com/736x/3e/ca/4c/3eca4cc358012b5c88bfc849e83485a6.jpg",
    tag: "Street Style",
  },
  {
    title: "Luxury Formal Wear",
    desc: "Exquisite tailoring and premium fabrics for the discerning gentleman.",
    button: "View Formal",
    image:
      "https://i.pinimg.com/736x/1b/0d/a2/1b0da24584e1a5f918ce1b3ffca46dd7.jpg",
    tag: "Luxury Collection",
  },
];

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop
        className={styles.slider}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={styles.slide}>
              {/* Background image with overlay */}
              <div className={styles.imageWrapper}>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={styles.bgImage}
                />
                <div className={styles.overlay} />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.tagWrapper}>
                  <span className={styles.tag}>{slide.tag}</span>
                  <span className={styles.tagLine} />
                </div>

                <h1 className={styles.title}>{slide.title}</h1>

                <p className={styles.desc}>{slide.desc}</p>

                {/* <button className={styles.ctaButton}>
                  <span>{slide.button}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button> */}

                <div className={styles.bottomIndicators}>
                  <span className={styles.indicatorDot} />
                  <span className={styles.indicatorText}>
                    {String(index + 1).padStart(2, '0')} /{" "}
                    {String(slides.length).padStart(2, '0')}
                  </span>
                  <span className={styles.indicatorDot} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;