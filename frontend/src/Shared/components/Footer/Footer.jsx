import React, { useState } from "react";
import styles from "./Footer.module.css";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiArrowUp, FiSend } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire this up to your newsletter API
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
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.links}>
          <h3>Shop</h3>
          <a href="#">New Arrivals</a>
          <a href="#">T-Shirts</a>
          <a href="#">Jackets</a>
          <a href="#">Accessories</a>
        </div>

        {/* Company Links */}
        <div className={styles.links}>
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
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
            You&apos;re on the list — welcome to MENOVA.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} MENOVA. All rights reserved.</p>

        <div className={styles.bottomLinks}>
          <a href="#">Privacy Policy</a>
          <span className={styles.dot} />
          <a href="#">Terms of Service</a>
        </div>

        <button className={styles.toTop} onClick={scrollToTop} aria-label="Back to top">
          <FiArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;