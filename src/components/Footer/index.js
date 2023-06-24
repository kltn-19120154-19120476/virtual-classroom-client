import { Typography } from "@mui/material";
import styles from "./styles.module.scss";

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.content}>
        <p className={styles.copyRight}>
          <a href="https://bigbluebuttonlms.software" alt="BigBlueButton LMS">
            <Typography variant="span" color="primary">
              BigBlueButton LMS
            </Typography>
          </a>{" "}
          - v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Footer;
