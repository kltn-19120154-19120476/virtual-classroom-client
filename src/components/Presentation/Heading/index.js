import React from "react";
import styles from "../styles.module.scss";

const HeadingPresentation = (props) => {
  const {
    heading = "This is heading",
    subHeading = "This is sub heading",
    type,
  } = props;
  return (
    <>
      {type === "preview" ? (
        <div className={styles.slide}>
          <p>{heading}</p>
          <p style={{ textAlign: "center" }}>{subHeading}</p>
        </div>
      ) : (
        <div className={styles.slide}>
          <h2>{heading}</h2>
          <h4 style={{ textAlign: "center" }}>{subHeading}</h4>
        </div>
      )}
    </>
  );
};

export default HeadingPresentation;
