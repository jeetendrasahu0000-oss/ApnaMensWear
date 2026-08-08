// import React from 'react'
// import style from './About.module.css'
// const About = () => {
//   return (
//     <div>About</div>
//   )
// }


// export default About;



import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <h1>Crafting Style for Modern Men</h1>
          <p>
            Premium menswear designed with confidence, elegance, and timeless
            craftsmanship.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <h2>Our Story</h2>
            <p>
              Founded with a vision to redefine men's fashion, our brand blends
              premium fabrics, modern tailoring, and timeless design. We believe
              every man deserves clothing that enhances confidence and reflects
              individuality.
            </p>

            <p>
              From everyday essentials to statement pieces, each collection is
              crafted with meticulous attention to detail and a commitment to
              quality that stands the test of time.
            </p>
          </div>

          <div className={styles.storyImage}>
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
              alt="Mens Fashion"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.features}>
        <h2>Why Choose Us</h2>

        <div className={styles.featureGrid}>
          <div className={styles.card}>
            <h3>Premium Quality</h3>
            <p>
              Carefully selected fabrics that deliver comfort, durability, and
              luxury.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Modern Design</h3>
            <p>
              Fashion-forward collections inspired by contemporary trends and
              timeless elegance.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Perfect Fit</h3>
            <p>
              Tailored cuts engineered to complement every body type with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.stat}>
          <h3>50K+</h3>
          <p>Happy Customers</p>
        </div>

        <div className={styles.stat}>
          <h3>100+</h3>
          <p>Premium Collections</p>
        </div>

        <div className={styles.stat}>
          <h3>5 Years</h3>
          <p>Fashion Excellence</p>
        </div>

        <div className={styles.stat}>
          <h3>98%</h3>
          <p>Customer Satisfaction</p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Elevate Your Wardrobe</h2>
        <p>
          Discover premium menswear designed for confidence, comfort, and style.
        </p>

        <button>Shop Collection</button>
      </section>
    </div>
  );
};

export default About;



