import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { loginFunc, loginGoogleFunc, registerFunc, resetAccount } from "../client/auth";
import { getGroupByIds } from "../client/group";
import { getPresentationByIds } from "../client/presentation";
import { getUserInfo } from "../client/user";
import LoadingScreen from "../components/LoadingScreen";
import { customToast } from "../utils";
import { useContext } from "react";
import { SocketContext } from "./socketContext";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const { socket } = useContext(SocketContext);

  const router = useRouter();

  const getUser = async () => {
    try {
      if (localStorage?.getItem("access_token")) {
        setIsLoadingAuth(true);
        const res = await getUserInfo();

        if (res?.status === "OK") {
          const userInfo = res?.data?.[0];

          const [groupListRes, presentationListRes] = await Promise.all([getGroupByIds([...userInfo.myGroupIds, ...userInfo.joinedGroupIds]), getPresentationByIds([])]);

          const groupListMap = {};

          const presentationListMap = {};

          groupListRes?.data?.forEach((group) => (groupListMap[group?._id] = group));

          presentationListRes?.data?.forEach((presentation) => (presentationListMap[presentation?._id] = presentation));

          userInfo.myGroups = userInfo.myGroupIds?.map((code) => groupListMap[code]) || [];

          userInfo.joinedGroups = userInfo.joinedGroupIds?.map((code) => groupListMap[code]) || [];

          userInfo.myPresentations = userInfo.presentationIds?.map((code) => presentationListMap[code]) || [];

          userInfo.collabPresentations = presentationListRes?.data?.filter((presentation) => presentation?.collaborators?.includes(userInfo._id)) || [];

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
      if (e.code === "ERR_BAD_REQUEST") {
        router.push("/active");
      }
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!["/login", "/register"].includes(window.location.pathname)) {
      getUser();
    } else {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  }, [router.asPath]);

  useEffect(() => {
    socket.on("startPresent", async (data) => {
      if (!window?.location?.pathname?.includes("presentation") && data?.groupId && (user?.myGroupIds?.includes(data.groupId) || user?.joinedGroupIds?.includes(data.groupId))) {
        toast(
          <div>
            <p>Presentation {data?.presentationName} is presenting, do you want to join now?</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="success" sx={{ marginLeft: 3, marginTop: 1 }} onClick={() => (window.location.href = `/presentation/${data.presentationId}/slideshow`)}>
                JOIN
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginLeft: 3, marginTop: 1 }}
                onClick={() => {
                  toast.dismiss();
                  router.reload();
                }}
              >
                NOT NOW
              </Button>
            </div>
          </div>,
          {
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          }
        );
      }
    });
  }, [user]);

  const login = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginFunc(data);
      if (res?.status === "OK") {
        localStorage.setItem("access_token", res?.data?.[0]?.access_token || "");
        await customToast("SUCCESS", "Login successful!");
        if (!res?.data?.[0]?.isActive) {
          window.location.href = "/active";
        } else {
          window.location.href = "/";
        }
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
        window.location.href = "/";
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
      window.location.href = "/active";
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
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
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

export { AuthContextProvider, AuthContext };
