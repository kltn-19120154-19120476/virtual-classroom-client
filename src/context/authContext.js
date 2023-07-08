import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { loginFunc, loginGoogleFunc, registerFunc, resetAccount } from "src/client/auth";
import { getRoomByIds } from "src/client/room";
import { getUserInfo } from "src/client/user";
import LoadingScreen from "src/components/LoadingScreen";
import { getLearningDashboardFromInternalMeetingId, getMeetingInfo, isMeetingRunning, updateLearningDashboards } from "src/service";
import { customToast, getFirst, isValid } from "src/utils";

const AuthContext = createContext();

const notGetUserPaths = ["/login", "/register"];

const notRequiredLoginPaths = ["/join", "/"];

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const router = useRouter();

  const getUser = async () => {
    try {
      if (localStorage && !localStorage.getItem("access_token") && !notRequiredLoginPaths.includes(router.pathname)) {
        window.location.href = "/login";
      }
      if (localStorage?.getItem("access_token")) {
        setIsLoadingAuth(true);
        const res = await getUserInfo();
        if (isValid(res)) {
          const userInfo = getFirst(res);

          const roomIds = [...userInfo.myRoomIds, ...userInfo.joinedRoomIds];

          const roomListRes = await getRoomByIds(roomIds);

          const meetingStateRes = await Promise.all(roomIds?.map((id) => isMeetingRunning(id)));

          const meetingInfoRes = await Promise.all(roomIds?.map((id) => getMeetingInfo(id)));

          const roomListMap = {};
          const meetingStateMap = {};
          const meetingInfoMap = {};

          roomIds.forEach((id, index) => {
            meetingStateMap[id] = meetingStateRes[index]?.running;
            meetingInfoMap[id] = meetingInfoRes[index];
          });

          roomListRes?.data?.forEach(
            (room) =>
              (roomListMap[room?._id] = { ...room, isMeetingRunning: meetingStateMap[room?._id], meetingInfo: meetingInfoMap[room?._id] }),
          );

          await Promise.all(
            userInfo.myRoomIds.map(async (id) => {
              const internalMeetingID = roomListMap[id]?.meetingInfo?.internalMeetingID;
              if (internalMeetingID) {
                const meetingLearningDashboard = await getLearningDashboardFromInternalMeetingId(
                  roomListMap[id]?.meetingInfo?.internalMeetingID,
                );
                if (meetingLearningDashboard.data) updateLearningDashboards(roomListMap[id], meetingLearningDashboard.data);
              }
            }),
          );

          userInfo.myRooms = userInfo.myRoomIds?.map((code) => roomListMap[code]) || [];

          userInfo.joinedRooms = userInfo.joinedRoomIds?.map((code) => roomListMap[code]) || [];

          userInfo.memberRooms = userInfo.joinedRooms?.filter((room) => room.memberIds?.includes(userInfo._id)) || [];

          setIsAuthenticated(true);

          setUser({ ...user, ...userInfo });

          localStorage.setItem("access_token", userInfo?.access_token || "");
          setCookie("access_token", userInfo?.access_token || "");
        } else {
          router.push("/login");
          setIsAuthenticated(false);
        }
      }
      setIsLoadingAuth(false);
    } catch (e) {
      console.log(e);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!notGetUserPaths.includes(router.pathname)) {
      getUser();
    }
  }, [router.asPath]);

  const login = async (data) => {
    try {
      setIsLoadingAuth(true);
      const res = await loginFunc(data);
      if (res?.status === "OK") {
        localStorage.setItem("access_token", getFirst(res)?.access_token || "");
        setCookie("access_token", getFirst(res)?.access_token || "");
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
      if (isValid(res)) {
        const userInfo = getFirst(res);
        setUser(userInfo);
        setIsAuthenticated(true);
        localStorage.setItem("access_token", userInfo?.access_token || "");
        setCookie("access_token", userInfo?.access_token || "");
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
      localStorage.setItem("access_token", getFirst(res)?.access_token || "");
      setCookie("access_token", getFirst(res)?.access_token || "");
      await customToast("SUCCESS", "Register successful!");
      window.location.href = "/";
      setIsLoadingAuth(false);
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
    deleteCookie("access_token");
    window.location.href = "/";
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
      {
        <>
          {isLoadingAuth && <LoadingScreen />}
          <div style={{ pointerEvents: isLoadingAuth ? "none" : "initial" }}>{children}</div>
        </>
      }
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
