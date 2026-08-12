import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import styles from "./HeroSection.module.css"




const slides = [
  {
    title: "Premium Style For Modern Men",
    desc: "Timeless outfits that blend confidence and comfort – for every occasion.",
    button: "Shop Collection",
    image:
      "https://i.pinimg.com/736x/ab/9c/00/ab9c00011daa500b3476fde67a7a5201.jpg",
    tag: "New Arrivals",
  },
  {
    title: "Winter Collection 2026",
    desc: "Upgrade your wardrobe with premium jackets and layered casual wear.",
    button: "Explore Now",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&q=80",
    tag: "Seasonal Picks",
  },
  {
    title: "Classic Looks, Modern Fit",
    desc: "Designed for men who value effortless style and superior craftsmanship.",
    button: "View Products",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1600&q=80",
    tag: "Best Sellers",
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
                                        {String(index + 1).padStart(2)} /{" "}
                                        {String(slides.length).padStart(2)}
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








