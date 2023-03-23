import React from "react";
import styles from "../styles.module.scss";

const ParagraphPresentation = (props) => {
  const {
    heading = "This is heading",
    paragraph = "This is paragraph",
    type,
  } = props;
  return (
    <>
      {type === "preview" ? (
        <div className={styles.slide}>
          <p>{heading}</p>
          <p>{paragraph}</p>
        </div>
      ) : (
        <div className={styles.slide}>
          <h2>{heading}</h2>
          <p>{paragraph}</p>
        </div>
      )}
    </>
  );
};

export default ParagraphPresentation;
