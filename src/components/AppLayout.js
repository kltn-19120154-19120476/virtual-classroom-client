import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";

const AppLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.appLayout}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
