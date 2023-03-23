import React, { useContext } from "react";
import LoadingScreen from "../components/LoadingScreen";
import UserProfile from "../components/UserProfile";
import { AuthContext } from "../context/authContext";

const Profile = () => {
  const { user, isLoadingAuth, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    window.location.href = "/login";
  }

  return !user || isLoadingAuth ? <LoadingScreen /> : <UserProfile user={user} />;
};

export default Profile;
