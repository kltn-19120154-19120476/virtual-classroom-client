import React, { useContext } from "react";
import LoadingScreen from "src/components/LoadingScreen";
import UserProfile from "src/components/UserProfile";
import { AuthContext } from "src/context/authContext";
import { getLinkWithPrefix } from "src/utils";

const Profile = () => {
    const { user, isLoadingAuth, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        window.location.href = getLinkWithPrefix("/login");
    }

    return !user || isLoadingAuth ? (
        <LoadingScreen />
    ) : (
        <UserProfile user={user} />
    );
};

export default Profile;
