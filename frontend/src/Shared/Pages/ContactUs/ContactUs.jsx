// import React from 'react'
// import style from './ContactUs.module.css'

// const ContactUs = () => {
//   return (
//     <div>ContactUs</div>
//   )
// }

// export default ContactUs



import React from "react";
import styles from "./ContactUs.module.css";

const ContactUs = () => {
  return (
    <div className={styles.contactPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Get In Touch</h1>
        <p>
          We'd love to hear from you. Whether you have questions about our
          collections, orders, or collaborations, our team is here to help.
        </p>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactInfo}>
          <h2>Contact Information</h2>

          <div className={styles.infoCard}>
            <h3>📍 Visit Us</h3>
            <p>123 Fashion Avenue, New Delhi, India</p>
          </div>

          <div className={styles.infoCard}>
            <h3>📞 Call Us</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className={styles.infoCard}>
            <h3>✉️ Email Us</h3>
            <p>support@menswear.com</p>
          </div>

          <div className={styles.infoCard}>
            <h3>🕒 Working Hours</h3>
            <p>Monday - Saturday</p>
            <p>10:00 AM - 8:00 PM</p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formContainer}>
          <h2>Send a Message</h2>

          <form className={styles.form}>
            <input type="text" placeholder="Your Name" />

            <input type="email" placeholder="Your Email" />

            <input type="text" placeholder="Subject" />

            <textarea
              rows="6"
              placeholder="Write your message..."
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Style Begins With Confidence</h2>
        <p>
          Explore our premium collections crafted for the modern gentleman.
        </p>
        <button>Shop Collection</button>
      </section>
    </div>
  );
};

export default ContactUs;

