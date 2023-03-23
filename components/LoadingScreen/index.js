import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import styles from "./styles.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingWrapper}>
      <CircularProgress />
    </div>
  );
};

export default LoadingScreen;
