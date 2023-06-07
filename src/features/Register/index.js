import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "src/context/authContext";
import * as yup from "yup";
import styles from "../Login/styles.module.scss";

function Register() {
  const router = useRouter();

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup.string().min(3, "Password must be at least 3 characters long"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Password and confirm password does not match"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const { signup, isLoadingAuth } = useContext(AuthContext);

  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Image src={"/images/bbb-logo.png"} width={250} height={55} objectFit="contain" alt="bbb-logo" />
      </div>
      <div className={styles.loginwrapper}>
        <h2 className={styles.loginTitle}>Create an Account</h2>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(signup)} className={styles.form}>
            <TextField
              style={{ marginBottom: 20 }}
              {...register("name")}
              placeholder="Name"
              label="Name"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              style={{ marginBottom: 20 }}
              {...register("email")}
              placeholder="Email"
              label="Email"
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              style={{ marginBottom: 20 }}
              {...register("password")}
              type="password"
              placeholder="Password"
              label="Password"
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              style={{ marginBottom: 20 }}
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm password"
              label="Confirm password"
              size="small"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <LoadingButton loading={isLoadingAuth} variant="contained" type="submit">
              REGISTER
            </LoadingButton>
          </form>

          <p>
            Already have an account?
            <Link href="/login" legacyBehavior>
              <a>
                <b>&nbsp;LOGIN</b>
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
