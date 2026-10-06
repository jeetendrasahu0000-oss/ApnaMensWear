import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiArrowUp, FiSend } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to newsletter API
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />

      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <h2>Apna Mens Wear</h2>
          <p>
            Premium men&apos;s fashion designed for modern lifestyles.
            Quality clothing with timeless style.
          </p>

          <div className={styles.socialIcons}>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop */}
        <div className={styles.links}>
          <h3>Shop</h3>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/filtered/t-shirts">T-Shirts</Link>
          <Link to="/filtered/jeans">Jeans</Link>
          <Link to="/filtered/accessories">Accessories</Link>
        </div>

        {/* Company */}
        <div className={styles.links}>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>

        {/* Help */}
        <div className={styles.links}>
          <h3>Help</h3>
          <Link to="/shipping-policy">Shipping</Link>
          <Link to="/return-policy">Returns</Link>
          <Link to="/size-guide">Size Guide</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletter}>
          <h3>Join Our Newsletter</h3>
          <p>Get updates about new collections and offers.</p>

          <form className={styles.inputBox} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              <FiSend />
              <span>Join</span>
            </button>
          </form>

          <p className={`${styles.subscribeMsg} ${subscribed ? styles.subscribeMsgShow : ""}`}>
            You&apos;re on the list — welcome to Apna Mens Wear.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Apna Mens Wear. All rights reserved.</p>

        <div className={styles.bottomLinks}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span className={styles.dot} />
          <Link to="/terms">Terms of Service</Link>
        </div>

        <button className={styles.toTop} onClick={scrollToTop} aria-label="Back to top">
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;