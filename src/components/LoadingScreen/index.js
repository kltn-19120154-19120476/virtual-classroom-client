import CircularProgress from "@mui/material/CircularProgress";
import styles from "./styles.module.scss";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingWrapper}>
      <CircularProgress color="primary" />
    </div>
  );
};

export default LoadingScreen;
