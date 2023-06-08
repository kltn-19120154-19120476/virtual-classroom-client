import styles from "./styles.module.scss";

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.content}>
        <p className={styles.copyRight}>BigBlueButton - LMS demo</p>
      </div>
    </div>
  );
};

export default Footer;
