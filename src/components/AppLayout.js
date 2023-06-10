import { useContext } from "react";
import { AuthContext } from "src/context/authContext";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated && user && <Header logout={logout} user={user} />}
      <div className={styles.appLayout}>{children}</div>
      <Footer />
    </>
  );
};

export default AppLayout;
