import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../../context/authContext";
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
      <div className={styles.loginwrapper}>
        <h2 className={styles.loginTitle}>Welcome to MeowClassroom</h2>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(signup)} className={styles.form}>
            <TextField style={{ marginBottom: 20 }} {...register("name")} placeholder="Name" label="Name" size="small" error={!!errors.name} helperText={errors.name?.message} />
            <TextField style={{ marginBottom: 20 }} {...register("email")} placeholder="Email" label="Email" size="small" error={!!errors.email} helperText={errors.email?.message} />
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
