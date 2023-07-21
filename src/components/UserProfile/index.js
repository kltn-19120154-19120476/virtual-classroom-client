import { yupResolver } from "@hookform/resolvers/yup";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { Avatar, Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateUserInfo } from "src/client/user";
import { isValid } from "src/utils";
import * as yup from "yup";
import styles from "./styles.module.scss";

const UserProfile = ({ user, getUser }) => {
  console.log({ user });
  const [updateMode, setUpdateMode] = useState(false);
  const schema = yup
    .object({
      password: yup.string().required("Password is required"),
      confirmedNewPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Password and confirm password does not match"),
    })
    .required();
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const handleUpdateUserInfo = async (data) => {
    if (!updateMode) {
      setUpdateMode(true);
    } else {
      const formData = {
        name: data?.name,
        password: data?.password || "",
        newPassword: data?.newPassword || "",
      };
      try {
        const res = await updateUserInfo(formData);
        if (isValid(res)) {
          toast.success("Update information successfully");
          setUpdateMode(false);
          getUser();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleChangeMode = (mode) => {
    setUpdateMode(mode);
  };

  useEffect(() => {
    setValue("name", user?.name);
    setValue("email", user?.email);
  }, [user]);

  return (
    <div className={styles.wapper}>
      <div className={styles.profile}>
        <Avatar className={styles.avatar}>{user?.name?.[0]}</Avatar>
        <Box
          className={styles.info}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit((data) => handleUpdateUserInfo(data))}
        >
          <Box>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  label="Name"
                  variant="outlined"
                  type="name"
                  disabled={!updateMode}
                  style={{ display: "inline-flex" }}
                  {...field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <TextField
              className={styles.infoField}
              id="email"
              label="Email"
              variant="outlined"
              value={user?.email}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors?.password}
                  helperText={errors?.password?.message}
                  className={styles.infoField}
                  label="Current password"
                  variant="outlined"
                  type="password"
                  autoComplete="current-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />

            <Controller
              name="newPassword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  error={!!errors?.newPassword}
                  helperText={errors?.newPassword?.message}
                  label="New password"
                  variant="outlined"
                  type="password"
                  autoComplete="new-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                />
              )}
            />
            <Controller
              name="confirmedNewPassword"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  className={styles.infoField}
                  error={!!errors?.confirmedNewPassword}
                  helperText={errors?.confirmedNewPassword?.message}
                  label="Confirm new password"
                  variant="outlined"
                  type="password"
                  autoComplete="confirm-new-password"
                  disabled={!updateMode}
                  style={
                    !updateMode
                      ? { display: "none" }
                      : {
                          display: "inline-flex",
                          width: "100%",
                        }
                  }
                  {...field}
                />
              )}
            />
          </Box>
          <div className={styles.btnWrapper}>
            {!updateMode ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleChangeMode(true);
                }}
              >
                <ModeEditIcon />
                &nbsp;Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleChangeMode(false);
                  }}
                  color="secondary"
                >
                  <DisabledByDefaultIcon />
                  &nbsp;Cancel
                </Button>
                <Button variant="contained" type="submit">
                  <SaveIcon />
                  &nbsp;Save
                </Button>
              </>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default UserProfile;
