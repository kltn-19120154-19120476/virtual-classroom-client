import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { inviteToGroup } from "src/client/group";
import LoadingScreen from "src/components/LoadingScreen";
import { AuthContext } from "src/context/authContext";
import { customToast, getLinkWithPrefix } from "src/utils";

const InvitePage = () => {
  const router = useRouter();
  const { user, getUser } = useContext(AuthContext);

  const handleInvite = async (groupId, code) => {
    try {
      const res = await inviteToGroup({
        groupId,
        code,
        userId: user._id,
      });
      if (res?.status === "OK") {
        window.location.href = getLinkWithPrefix(`/group/${groupId}`);
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
