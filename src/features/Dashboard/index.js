import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { Button, Card, Container, Grid, IconButton, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createRoom, updateRoom } from "src/client/room";
import { handleCreateMeeting, handleJoinMeeting } from "src/service";
import { customToast, formatTime, getFirst, isValid } from "src/utils";
import styles from "./styles.module.scss";

const Dashboard = ({ user, getUser }) => {
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });
  const [openCreateGroupForm, setOpenCreateGroupForm] = useState(false);

  const handleCreateGroup = async (data) => {
    try {
      const res = await createRoom(data);
      if (isValid(res)) {
        const roomInfo = getFirst(res);

        const meetingInfo = await handleCreateMeeting(roomInfo._id, roomInfo.name, user?._id, roomInfo.presentation);

        await updateRoom({ id: roomInfo._id, meetingInfo: JSON.stringify(meetingInfo) });

        getUser();
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
    setOpenCreateGroupForm(false);
  };

  const NoRoomsWrapper = () => (
    <Grid item xs={12}>
      <Card className={styles.noRecordWrapper}>
        <IconButton className={styles.camIcon} color="primary">
          <GroupsIcon />
        </IconButton>
        <h2>You don&apos;t have any rooms yet!</h2>

        <p>Create your first room by clicking on the button below and entering a room name.</p>

        <Button onClick={() => setOpenCreateGroupForm(true)} variant="contained" startIcon={<VideoCallIcon />}>
          new room
        </Button>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="xl">
      <Grid container spacing={6} className={styles.wrapper}>
        {user?.myGroups?.length < 1 ? (
          <NoRoomsWrapper />
        ) : (
          <>
            <Grid item xs={12} className={styles.actionButtonWrapper}>
              <Button onClick={() => setOpenCreateGroupForm(true)} variant="contained" startIcon={<VideoCallIcon />}>
                new room
              </Button>
            </Grid>
            <Grid item container spacing={2} xs={12} className={styles.groupWrapper}>
              {user?.myGroups?.map((room) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={room?._id}>
                  <Link href={`/rooms/${room?._id}`}>
                    <Card className={styles.card}>
                      <div className={styles.cardIcon}>
                        <VideoCameraFrontIcon />
                      </div>

                      <div className={styles.cardInfo}>
                        <h2>{room.name}</h2>
                        <p>Last session: {formatTime(JSON.parse(room.meetingInfo)?.startTime)}</p>
                      </div>
                      <div className={styles.cardFooter}>
                        <IconButton>
                          <ContentCopyIcon />
                        </IconButton>

                        <Button
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinMeeting({ data: { password: user?._id, fullName: user?.name, role: "moderator" }, room, user });
                          }}
                        >
                          Start
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Dialog open={openCreateGroupForm} onClose={() => setOpenCreateGroupForm(false)} fullWidth>
          <form onSubmit={handleSubmit(handleCreateGroup)}>
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
              Create new room
            </DialogTitle>
            <DialogContent className={styles.groupContent}>
              <TextField label="Room's name" placeholder="Enter room's name" {...register("name")} fullWidth />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpenCreateGroupForm(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </Container>
  );
};

export default Dashboard;
