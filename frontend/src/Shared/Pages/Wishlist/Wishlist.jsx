import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./Wishlist.module.css";

const Wishlist = () => {
  const navigate = useNavigate();

  // TODO: ise apne backend se connect karo — /v1/user/wishlist
  const wishlistItems = [];

  if (wishlistItems.length === 0) {
    return (
      <div className={styles.empty}>
        <FiHeart size={56} />
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love and find them here anytime.</p>
        <button onClick={() => navigate("/")} className={styles.btn}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>My Wishlist</h1>
      {/* Grid yahan aayega */}
    </div>
  );
};

export default Wishlist;