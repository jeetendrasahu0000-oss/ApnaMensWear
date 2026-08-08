// import React from 'react'
// import style from './Footer.module.css'

// const Footer = () => {
//   return (
//     <div>Footer</div>
//   )
// }

// export default Footer;



// import React from "react";
// import styles from "./Footer.module.css";

// const Footer = () => {
//   return (
//     <footer className={styles.footer}>

//       <div className={styles.container}>

//         {/* Brand */}
//         <div className={styles.brand}>
//           <h2>MENOVA</h2>
//           <p>
//             Premium men's fashion designed for modern lifestyles.
//             Quality clothing with timeless style.
//           </p>
//         </div>


//         {/* Links */}
//         <div className={styles.links}>
//           <h3>Shop</h3>
//           <a href="#">New Arrivals</a>
//           <a href="#">T-Shirts</a>
//           <a href="#">Jackets</a>
//           <a href="#">Accessories</a>
//         </div>


//         <div className={styles.links}>
//           <h3>Company</h3>
//           <a href="#">About Us</a>
//           <a href="#">Contact</a>
//           <a href="#">Privacy Policy</a>
//           <a href="#">Terms</a>
//         </div>


//         {/* Newsletter */}
//         <div className={styles.newsletter}>
//           <h3>Join Our Newsletter</h3>

//           <p>
//             Get updates about new collections and offers.
//           </p>

//           <div className={styles.inputBox}>
//             <input 
//               type="email" 
//               placeholder="Your email"
//             />

//             <button>
//               Join
//             </button>
//           </div>

//         </div>


//       </div>


//       <div className={styles.bottom}>
//         <p>
//           © 2026 MENOVA. All rights reserved.
//         </p>

//         <div className={styles.social}>
//           <span>Instagram</span>
//           <span>Facebook</span>
//           <span>Twitter</span>
//         </div>
//       </div>


//     </footer>
//   );
// };


// export default Footer;




import React from "react";
import styles from "./Footer.module.css";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>

      <div className={styles.container}>

        {/* Brand */}
        <div className={styles.brand}>
          <h2>MENOVA</h2>

          <p>
            Premium men's fashion designed for modern lifestyles.
            Quality clothing with timeless style.
          </p>


          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
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

          <p>
            Get updates about new collections and offers.
          </p>


          <div className={styles.inputBox}>

            <input 
              type="email"
              placeholder="Your email"
            />

            <button>
              Join
            </button>

          </div>

        </div>


      </div>


      {/* Black Bottom Bar */}

      <div className={styles.bottom}>

        <p>
          © 2026 MENOVA. All rights reserved.
        </p>


        <div className={styles.social}>
          <span>Instagram</span>
          <span>Facebook</span>
          <span>Twitter</span>
        </div>

      </div>


    </footer>
  );
};


export default Footer;
