import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "src/context/authContext";
import * as yup from "yup";
import styles from "./styles.module.scss";

function Login() {
  const router = useRouter();
  const schema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().min(3, "Password must be at least 3 characters long"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const { login, loginWithGoogle, isLoadingAuth, forgotPassword } = useContext(AuthContext);

  const [openModal, setOpenModal] = useState(false);

  const forgotPasswordForm = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleForgotPassword = async (data) => {
    await forgotPassword(data);
    setOpenModal(false);
  };

  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Image src={"/images/bbb-logo.png"} width={250} height={55} objectFit="contain" alt="bbb-logo" />
      </div>
      <div className={styles.loginwrapper}>
        <h2 className={styles.loginTitle}>Sign in</h2>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(login)} className={styles.form}>
            <TextField
              {...register("email")}
              style={{ marginBottom: 20 }}
              placeholder="Email"
              label="Email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register("password")}
              style={{ marginBottom: 20 }}
              type="password"
              placeholder="Password"
              label="Password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <LoadingButton loading={isLoadingAuth} variant="contained" type="submit">
              LOGIN
            </LoadingButton>

            <span className={styles.forgotPasswordBtn} onClick={() => setOpenModal(true)}>
              Forgot password?
            </span>
          </form>
          <GoogleLogin
            size="large"
            auto_select
            shape="circle"
            onSuccess={(credentialResponse) =>
              loginWithGoogle({
                credential: credentialResponse.credential,
              })
            }
            onError={async (e) => {
              await customToast("ERROR", e || "Unexpected error");
            }}
            className={styles.googleLogin}
          />
          <p>
            Don&apos;t have an account?
            <Link href="/register" legacyBehavior>
              <a>
                <b>&nbsp;REGISTER</b>
              </a>
            </Link>
          </p>
        </div>
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} style={{ width: "100%" }}>
        <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)}>
          <DialogTitle id="alert-dialog-title">Enter your email</DialogTitle>
          <DialogContent style={{ overflowY: "initial" }}>
            <TextField
              label="Email"
              placeholder="Your email"
              {...forgotPasswordForm.register("email")}
              fullWidth
              error={!!forgotPasswordForm.formState.errors?.email}
              helperText={forgotPasswordForm.formState.errors?.email?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => setOpenCreateGroupForm(false)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Login;
