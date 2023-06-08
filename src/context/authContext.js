import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { loginFunc, loginGoogleFunc, registerFunc, resetAccount } from "src/client/auth";
import { getRoomByIds } from "src/client/room";
import { getUserInfo } from "src/client/user";
import LoadingScreen from "src/components/LoadingScreen";
import { customToast, getLinkWithPrefix } from "src/utils";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const router = useRouter();

  const getUser = async () => {
    try {
      if (localStorage?.getItem("access_token")) {
        setIsLoadingAuth(true);
        const res = await getUserInfo();

        if (res?.status === "OK") {
          const userInfo = res?.data?.[0];

          const [groupListRes] = await Promise.all([getRoomByIds([...userInfo.myGroupIds, ...userInfo.joinedGroupIds])]);

          const groupListMap = {};

          groupListRes?.data?.forEach((group) => (groupListMap[group?._id] = group));

          userInfo.myGroups = userInfo.myGroupIds?.map((code) => groupListMap[code]) || [];

          userInfo.joinedGroups = userInfo.joinedGroupIds?.map((code) => groupListMap[code]) || [];

          userInfo.coOwnerGroups = userInfo.joinedGroups?.filter((group) => group.coOwnerIds?.includes(userInfo._id)) || [];

          userInfo.memberGroups = userInfo.joinedGroups?.filter((group) => group.memberIds?.includes(userInfo._id)) || [];

          setIsAuthenticated(true);

          setUser({ ...user, ...userInfo });

          localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        } else {
          router.push("/login");
          setIsAuthenticated(false);
        }
      }
      setIsLoadingAuth(false);
    } catch (e) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (router.pathname !== "/login") {
      getUser();
    }
  }, [router.asPath]);

  const login = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginFunc(data);
      if (res?.status === "OK") {
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        window.location.href = "/";
      } else {
        await customToast("ERROR", res?.message);
        setIsLoadingAuth(false);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message || "Login failed!");
      setIsLoadingAuth(false);
    }
  };

  const loginWithGoogle = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginGoogleFunc(data);
      if (res?.status === "OK") {
        setUser(res?.data?.[0]);
        setIsAuthenticated(true);
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        await customToast("SUCCESS", "Login successful!");
        window.location.href = getLinkWithPrefix("/");
      } else {
        await customToast("ERROR", res.message);
        setIsLoadingAuth(false);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message || "Login failed!");
      setIsLoadingAuth(false);
    }
  };

  const signup = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await registerFunc(data);
      localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
      setIsLoadingAuth(false);
      await customToast("SUCCESS", "Register successful!");
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message || "Register failed!");
      setIsLoadingAuth(false);
    }
  };

  const forgotPassword = async (data) => {
    try {
      const res = await resetAccount(data);
      if (res?.status === "OK") {
        await customToast("INFO", "Your password has been reset, please check your email!", 5000);
      } else {
        await customToast("ERROR", res?.message || "Reset password failed!");
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message || "Reset password failed!");
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = getLinkWithPrefix("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        getUser,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        forgotPassword,
        signup,
        isLoadingAuth,
      }}
    >
      {isLoadingAuth ? <LoadingScreen /> : <>{children}</>}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
