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
      "https://i.pinimg.com/736x/05/b0/eb/05b0ebcec1bfc29002cbc6479710ec20.jpg",
    tag: "New Arrivals",
  },
  {
    title: "Winter Collection 2026",
    desc: "Upgrade your wardrobe with premium jackets and layered casual wear.",
    button: "Explore Now",
    image:
      "https://i.pinimg.com/1200x/01/64/8c/01648cb657af7993643533260833daf7.jpg",
    tag: "Seasonal Picks",
  },
  {
    title: "Classic Looks, Modern Fit",
    desc: "Designed for men who value effortless style and superior craftsmanship.",
    button: "View Products",
    image:
      "https://i.pinimg.com/736x/c6/12/9c/c6129c1e78cfc4f2b92a65ff5455eaf6.jpg",
    tag: "Best Sellers",
  },
  {
    title: "Summer Breeze Collection",
    desc: "Lightweight fabrics and breathable designs for the perfect summer look.",
    button: "Shop Summer",
    image:
      "https://i.pinimg.com/1200x/bb/f8/f3/bbf8f3fc435f46777c5098fe9ae5e572.jpg",
    tag: "Summer 2026",
  },
  {
    title: "Urban Streetwear",
    desc: "Bold styles, relaxed fits – street fashion redefined for the modern man.",
    button: "Explore Streetwear",
    image:
      "https://i.pinimg.com/736x/2b/6f/da/2b6fda338af21809cab9d551ce749f51.jpg",
    tag: "Street Style",
  },
  {
    title: "Luxury Formal Wear",
    desc: "Exquisite tailoring and premium fabrics for the discerning gentleman.",
    button: "View Formal",
    image:
      "https://i.pinimg.com/736x/e3/ca/e9/e3cae90cd3718cd2ed47eaa9c8aaad19.jpg",
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