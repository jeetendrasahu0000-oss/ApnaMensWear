import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Page Not Found</h2>
      <p className={styles.text}>
        Lagta hai ye page exist nahi karta ya hata diya gaya hai.
      </p>

      <div className={styles.actions}>
        <button onClick={() => navigate("/")} className={styles.primaryBtn}>
          Go Home
        </button>
        <button onClick={() => navigate(-1)} className={styles.secondaryBtn}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;