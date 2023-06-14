import { yupResolver } from "@hookform/resolvers/yup";
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
import CopyToClipboard from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createRoom, updateRoom } from "src/client/room";
import { handleCreateMeeting, handleJoinMeeting } from "src/service";
import { formatTime, getFirst, isValid } from "src/utils";
import * as yup from "yup";
import styles from "./styles.module.scss";

const Dashboard = ({ user, getUser }) => {
  const schema = yup.object().shape({
    name: yup.string().required("Room name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [openCreateRoomForm, setOpenCreateRoomForm] = useState(false);

  const handleCreateRoom = async (data) => {
    try {
      const res = await createRoom(data);
      if (isValid(res)) {
        const roomInfo = getFirst(res);

        const meetingInfo = await handleCreateMeeting({ roomInfo, user });

        await updateRoom({ id: roomInfo._id, meetingInfo: JSON.stringify(meetingInfo) });
        toast.success(res.message);
        reset();
        getUser();
      } else {
        toast.error(res?.message);
      }
    } catch (e) {
      toast.error(e?.message || e);
    }
    setOpenCreateRoomForm(false);
  };

  const NoRoomsWrapper = () => (
    <Grid item xs={12}>
      <Card className={styles.noRecordWrapper}>
        <IconButton className={styles.camIcon} color="primary">
          <GroupsIcon />
        </IconButton>
        <h2>You don&apos;t have any rooms yet!</h2>

        <p>Create your first room by clicking on the button below and entering a room name.</p>

        <Button onClick={() => setOpenCreateRoomForm(true)} variant="contained" startIcon={<VideoCallIcon />}>
          new room
        </Button>
      </Card>
    </Grid>
  );

  const RoomCard = ({ room }) =>
    room ? (
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
              <CopyToClipboard
                text={`${window?.location?.host}/join?meetingID=${room._id}&meetingName=${room.name}`}
                onCopy={() => toast.success("Copied join url")}
              >
                <IconButton onClick={(e) => e.stopPropagation()}>
                  <ContentCopyIcon />
                </IconButton>
              </CopyToClipboard>

              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinMeeting({ room, user });
                }}
              >
                {room?.isOwner ? "Start" : "Join"}
              </Button>
            </div>
          </Card>
        </Link>
      </Grid>
    ) : (
      <></>
    );

  return (
    <Container maxWidth="xl">
      <Grid container spacing={6} className={styles.wrapper}>
        {user?.myRooms?.length + user?.joinedRooms?.length < 1 ? (
          <NoRoomsWrapper />
        ) : (
          <>
            <Grid item xs={12} className={styles.actionButtonWrapper}>
              <Button onClick={() => setOpenCreateRoomForm(true)} variant="contained" startIcon={<VideoCallIcon />}>
                new room
              </Button>
            </Grid>
            <Grid item container spacing={2} xs={12} className={styles.roomWrapper}>
              {user?.myRooms?.map((room) => (
                <RoomCard room={room} key={room?._id} />
              ))}
              {user?.joinedRooms?.map((room) => (
                <RoomCard room={room} key={room?._id} />
              ))}
            </Grid>
          </>
        )}

        <Dialog open={openCreateRoomForm} onClose={() => setOpenCreateRoomForm(false)} fullWidth>
          <form onSubmit={handleSubmit(handleCreateRoom)}>
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.4rem" }}>
              Create new room
            </DialogTitle>
            <DialogContent className={styles.roomContent}>
              <TextField
                label="Room name"
                placeholder="Enter room name"
                {...register("name")}
                fullWidth
                error={!!errors?.name}
                helperText={errors?.name?.message}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setOpenCreateRoomForm(false)}>
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
