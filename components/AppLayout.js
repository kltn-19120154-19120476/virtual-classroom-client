import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Header/styles.module.scss";
import { Container } from "@mui/system";


const AppLayout = ({ children }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const checkNotLoggedIn = window?.location?.href?.includes("active") || window?.location?.href?.includes("invite");
  const isShowing = window.location.href.includes("slideshow");
  if (!isAuthenticated || checkNotLoggedIn || !user || isShowing) {
    return <>{children}</>;
  }

  return (
    <>
      <Header logout={logout} user={user} />
      <Container
        container
        maxWidth="xl"
      >
        <div className={styles.appLayout}>{children}</div>
      </Container>
      <Footer />
    </>
  );
};

export default AppLayout;
