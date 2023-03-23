import React, { useContext } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { AuthContext } from "../context/authContext";
import Dashboard from "../features/Dashboard";
import Breadcrumb from "../components/Breadcrumb";
const Home = () => {
  const { user, getUser, isLoadingAuth, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  return isLoadingAuth || !user ? <LoadingScreen /> : <Dashboard user={user} getUser={getUser} />;
};

export default Home;
