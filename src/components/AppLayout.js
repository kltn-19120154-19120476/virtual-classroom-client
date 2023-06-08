import { Container } from "@mui/system";
import { useContext } from "react";
import { AuthContext } from "src/context/authContext";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";

const AppLayout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <>
      <Header logout={logout} user={user} />
      <div className={styles.appLayout}>
        <Container maxWidth="xl">{children}</Container>
      </div>
      <Footer />
    </>
  );
};

export default AppLayout;
