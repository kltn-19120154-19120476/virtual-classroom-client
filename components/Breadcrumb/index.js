import Link from "next/link";
import React from "react";
import styles from "./styles.module.scss";

const Breadcrumb = (props) => {
  const { paths } = props;
  return (
    <div className={styles.breadcrumb}>
      {paths.map((path, index) => {
        return (
          <Link key={index} href={path.href} legacyBehavior>
            <a>{index ? <>&raquo; {path.label}&nbsp;&nbsp;</> : <>{path.label}&nbsp;&nbsp;</>}</a>
          </Link>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
