import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { inviteToGroup } from "../client/group";
import { AuthContext } from "../context/authContext";
import { customToast } from "../utils";
import LoadingScreen from "../components/LoadingScreen";

const InvitePage = () => {
  const router = useRouter();
  const { user, getUser } = useContext(AuthContext);

  const handleInvite = async (groupId, code) => {
    try {
      const res = await inviteToGroup({ groupId, code, userId: user._id });
      if (res?.status === "OK") {
        window.location.href = `/group/${groupId}`;
        await getUser();
        await customToast("SUCCESS", "Join group successfully");
      }
    } catch (err) {
      router.push("/");
      await customToast("ERROR", err);
    }
  };

  useEffect(() => {
    const { groupId = "", code = "" } = router.query;
    handleInvite(groupId, code);
  }, []);

  return LoadingScreen;
};

export default InvitePage;
