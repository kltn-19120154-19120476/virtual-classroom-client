import { yupResolver } from "@hookform/resolvers/yup";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { Avatar, Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { updateUserInfo } from "../../client/user";
import { customToast } from "../../utils";
import styles from "./styles.module.scss";

const UserProfile = ({ user }) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [name, setName] = useState(user?.name || "default-name");

  const schema = yup
    .object({
      password: yup.string().required("Password is required"),
      newPassword: yup.string().required("New password is required"),
      confirmedNewPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Password and confirm password does not match"),
    })
    .required();
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) });

  const handleUpdateUserInfo = async (data) => {
    if (!updateMode) {
      setUpdateMode(true);
    } else {
      const formData = {
        name: data.name,
        password: data.password,
        newPassword: data.newPassword,
      };
      try {
        const res = await updateUserInfo(formData);
        if (res.status === "OK") {
          await customToast("Update information successfully!");
        } else {
          await customToast("ERROR", res.message);
        }
        setUpdateMode(false);
      } catch (error) {
        await customToast("ERROR", error.response.data.message);
        setUpdateMode(false);
      }
    }
  };

  const handleChangeMode = (mode) => {
    setUpdateMode(mode);
  };

  return (
    <div className={styles.wapper}>
      <div className={styles.profile}>
        <Avatar className={styles.avatar}>{user?.name[0]}</Avatar>
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
              defaultValue={name}
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
            />
            <Controller
              name="password"
              defaultValue=""
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
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {!updateMode && (
              <Button
                variant="contained"
                className="btnPrimary custom-button"
                type="button"
                sx={{ marginRight: "20px" }}
                onClick={() => {
                  handleChangeMode(true);
                }}
              >
                <ModeEditIcon />
                &nbsp;Edit
              </Button>
            )}
            {updateMode && (
              <Button
                variant="contained"
                className="btnPrimary custom-button"
                type="submit"
                sx={{ marginRight: "20px" }}
              >
                <SaveIcon />
                &nbsp;Save
              </Button>
            )}
            {updateMode && (
              <Button
                variant="contained"
                className="btnLightPrimiary custom-button"
                type="button"
                onClick={() => {
                  handleChangeMode(false);
                }}
              >
                <DisabledByDefaultIcon />
                &nbsp;Cancel
              </Button>
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default UserProfile;
