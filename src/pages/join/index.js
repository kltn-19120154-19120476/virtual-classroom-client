import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, TextField } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { BBB_DEFAULT_ATTENDEE_PASSWORD } from "src/sysconfig";
import * as yup from "yup";
import styles from "./styles.module.scss";

// Join from server side
// export async function getServerSideProps(ctx) {
//   const res = await callBBBClient({
//     meetingID: ctx.query.meetingID,
//     password: BBB_DEFAULT_ATTENDEE_PASSWORD,
//     role: "attendee",
//     apiCall: "join",
//     fullName: "Guest",
//   });

//   return {
//     redirect: {
//       permanent: false,
//       destination: res.joinUrl || "/rooms",
//     },
//   };
// }

const JoinPage = () => {
  const router = useRouter();
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    // password: yup.string().required("Meeting password is required"),
  });

  const joinBBBMeeting = async ({ name, password }) => {
    const res = await callBBBClient({
      meetingID: router.query.meetingID,
      password: password || BBB_DEFAULT_ATTENDEE_PASSWORD,
      role: "GUEST",
      apiCall: "join",
      fullName: name,
    });

    if (res.joinUrl) window.open(res.joinUrl, "_self");
    else toast.error(res.message);
  };

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Image src={"/images/bbb-logo.png"} width={250} height={55} objectFit="contain" alt="bbb-logo" />
      </div>
      <Card className={styles.loginwrapper}>
        <h2 className={styles.loginTitle}>
          {router.query?.inviter} invited you to join meeting {router.query?.meetingName}
        </h2>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(joinBBBMeeting)} className={styles.form}>
            <TextField
              {...register("name")}
              style={{ marginBottom: 20 }}
              placeholder="Name"
              label="Name"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
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
            <Button color="primary" variant="contained" type="submit">
              JOIN
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default JoinPage;
