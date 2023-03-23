import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { activeAccount } from "../../client/auth";
import { sendVerificationEmail } from "../../client/user";
import styles from "../../features/Login/styles.module.scss";
import { customToast } from "../../utils";

const ActivePage = () => {
  const router = useRouter();

  const { userId = "", activeCode = "" } = router.query;

  const [isVerifying, setIsVerifying] = useState(false);

  const handleActiveAccount = async () => {
    if (userId && activeCode) {
      try {
        setIsVerifying(true);
        const data = { userId, activeCode };
        const res = await activeAccount(data);
        if (res?.status === "OK") {
          await customToast("SUCCESS", res?.message);
          window.location.href = "/";
        }
        setIsVerifying(false);
      } catch (e) {
        await customToast("ERROR", e?.response?.data?.message);
        setIsVerifying(false);
      }
    }
  };

  const handleResendVerificationEmail = async () => {
    try {
      const res = await sendVerificationEmail();
      if (res.status === "OK") {
        await customToast("SUCCESS", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    handleActiveAccount();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.loginwrapper}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {isVerifying
          ? "Please wait while we verify your account..."
          : "We sent a verification link to your email to verify your email address and activate your account."}

        {!isVerifying && (
          <Button
            className="custom-button"
            onClick={handleResendVerificationEmail}
            variant="contained"
            style={{ marginTop: 20 }}
          >
            RE-SEND VERIFICATION EMAIL
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivePage;
