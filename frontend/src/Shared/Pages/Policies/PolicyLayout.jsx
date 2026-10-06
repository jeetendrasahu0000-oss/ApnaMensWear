import styles from "./PolicyLayout.module.css";

const PolicyLayout = ({ title, children }) => (
  <div className={styles.wrapper}>
    <h1 className={styles.title}>{title}</h1>
    <div className={styles.content}>{children}</div>
  </div>
);

export default PolicyLayout;