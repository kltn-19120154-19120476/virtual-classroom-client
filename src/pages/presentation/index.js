import React, { useContext } from "react";
import Breadcrumb from "src/components/Breadcrumb";
import LoadingScreen from "src/components/LoadingScreen";
import { AuthContext } from "src/context/authContext";
import Presentation from "src/features/Presentation";
import { getLinkWithPrefix } from "src/utils";

const PresentationPage = () => {
  const { user, getUser, isLoadingAuth, isAuthenticated } =
    useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = getLinkWithPrefix("/login");
  }

  return isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
        ]}
      />
      <Presentation user={user} getUser={getUser} />
    </>
  );
};

export default PresentationPage;
