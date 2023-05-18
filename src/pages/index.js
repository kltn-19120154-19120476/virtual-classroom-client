import React, { useContext } from "react";
import LoadingScreen from "src/components/LoadingScreen";
import { AuthContext } from "src/context/authContext";
import Dashboard from "src/features/Dashboard";
import Breadcrumb from "src/components/Breadcrumb";
import { getLinkWithPrefix } from "src/utils";
const Home = () => {
  const { user, getUser, isLoadingAuth, isAuthenticated } =
    useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = getLinkWithPrefix("/login");
  }

  return isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <Dashboard user={user} getUser={getUser} />
  );
};

export default Home;
