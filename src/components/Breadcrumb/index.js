import Link from "next/link";
import styles from "./styles.module.scss";

const Breadcrumb = (props) => {
  const { paths } = props;
  return (
    <div className={styles.breadcrumb}>
      {paths.map((path, index) => {
        return (
          <Link key={path.href} href={path.href} legacyBehavior>
            <a>{index ? <>&raquo; {path.label}&nbsp;&nbsp;</> : <>{path.label}&nbsp;&nbsp;</>}</a>
          </Link>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
