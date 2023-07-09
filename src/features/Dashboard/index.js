import { yupResolver } from "@hookform/resolvers/yup";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { LoadingButton } from "@mui/lab";
import { Button, Card, Chip, Container, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createRoom } from "src/client/room";
import { NoData } from "src/components/NoDataNotification";
import { handleCreateMeeting, handleJoinMeeting } from "src/service";
import { getMeetingInviteLink } from "src/service/UserService";
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
  const [loadingCreateRoom, setLoadingCreateRoom] = useState(false);

  const handleCreateRoom = async (data) => {
    setLoadingCreateRoom(true);
    try {
      const res = await createRoom(data);
      if (isValid(res)) {
        const roomInfo = getFirst(res);

        await handleCreateMeeting({ roomInfo, user });

        toast.success(res.message);
        reset();
        getUser();
      } else {
        toast.error(res?.message);
      }
    } catch (e) {
      toast.error(e?.message || e);
      setLoadingCreateRoom(false);
    }
    setOpenCreateRoomForm(false);
    setLoadingCreateRoom(false);
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

  const RoomCard = ({ room }) => {
    const [meetingLoading, setMeetingLoading] = useState(false);

    return room ? (
      <Grid item xs={12} sm={6} md={4} lg={3} key={room?._id}>
        <Link href={`/rooms/${room?._id}`}>
          <Card className={styles.card}>
            <div className={styles.roomState}>
              {room?.isOwner ? <Chip label="OWNER" color="primary" /> : <Chip label="MEMBER" color="secondary" />}
              {room?.isMeetingRunning && <Chip label="Running" color="success" />}
            </div>

            <div className={styles.cardIcon}>
              <VideoCameraFrontIcon />
            </div>

            <div className={styles.cardInfo}>
              <h2>{room.name}</h2>
              <p>Current session: {formatTime(room.meetingInfo.startTime)}</p>
            </div>
            <div className={styles.cardFooter}>
              <CopyToClipboard
                text={getMeetingInviteLink(room, user)}
                onCopy={() => toast.success("Meeting invite link has been copied to clipboard")}
              >
                <IconButton onClick={(e) => e.stopPropagation()} size="large">
                  <Tooltip title="Copy invite meeting link">
                    <ContentCopyIcon />
                  </Tooltip>
                </IconButton>
              </CopyToClipboard>

              <Tooltip title={`${room?.isOwner && !room?.isMeetingRunning ? "Start" : "Join"} meeting`}>
                <LoadingButton
                  variant="outlined"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setMeetingLoading(true);
                    await handleJoinMeeting({ room, user });
                    setMeetingLoading(false);
                  }}
                  loading={meetingLoading}
                >
                  {room?.isOwner && !room?.isMeetingRunning ? "Start" : "Join"}
                </LoadingButton>
              </Tooltip>
            </div>
          </Card>
        </Link>
      </Grid>
    ) : (
      <></>
    );
  };

  return (
    <Container maxWidth="xl">
      {user?.myRooms?.length + user?.joinedRooms?.length < 1 ? (
        <NoData
          title="You don't have any rooms yet!"
          description="Create your first room by clicking on the button below and entering a room name."
          icon={<GroupsIcon />}
          refreshBtnIcon={<VideoCallIcon />}
          refreshBtnText="new room"
          onRefresh={() => setOpenCreateRoomForm(true)}
        />
      ) : (
        <Grid container spacing={6} className={styles.wrapper}>
          {user && (
            <Grid item xs={12} className={styles.actionButtonWrapper}>
              <Button onClick={() => setOpenCreateRoomForm(true)} variant="contained" startIcon={<VideoCallIcon />}>
                new room
              </Button>
            </Grid>
          )}
          <Grid item container spacing={2} xs={12} className={styles.roomWrapper}>
            {user?.myRooms?.map((room) => (
              <RoomCard room={room} key={room?._id} />
            ))}
            {user?.joinedRooms?.map((room) => (
              <RoomCard room={room} key={room?._id} />
            ))}
          </Grid>
        </Grid>
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
            <LoadingButton variant="contained" type="submit" loading={loadingCreateRoom}>
              Create
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
