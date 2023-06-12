import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { deleteRoomById, getRoomDetail, updateRoleInRoom } from "src/client/room";
import { getUserByIds } from "src/client/user";
import { withLogin } from "src/components/HOC/withLogin";
import InsertDocuments from "src/components/InsertDocuments";
import LearningDashboards from "src/components/LearningDashboard";
import RoomAccess from "src/components/RoomAccess";
import RoomRecordings from "src/components/RoomRecordings";
import { AuthContext } from "src/context/authContext";
import { handleJoinMeeting } from "src/service";
import { customToast, formatTime, getFirst, isValid } from "src/utils";
import styles from "./styles.module.scss";

const RoomDetailPage = () => {
  const [room, setRoom] = useState(null);
  const router = useRouter();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { user, getUser } = useContext(AuthContext);

  const isOwner = user?._id === room?.ownerId;

  const getInfoOfGroup = async () => {
    try {
      const res = await getRoomDetail(router.query.id);
      if (isValid(res)) {
        const groupInfo = getFirst(res);

        const [userListRes] = await Promise.all([getUserByIds([groupInfo.ownerId, ...groupInfo.memberIds, ...groupInfo.coOwnerIds])]);

        const userListMap = {};

        userListRes?.data?.forEach((user) => (userListMap[user?._id] = user));

        groupInfo.owner = userListMap[groupInfo.ownerId];
        groupInfo.members = groupInfo.memberIds.map((id) => userListMap[id]);
        groupInfo.coOwners = groupInfo.coOwnerIds.map((id) => userListMap[id]);
        groupInfo.total = groupInfo.memberIds.length + groupInfo.coOwnerIds.length + 1;
        groupInfo.meetingInfo = JSON.parse(groupInfo.meetingInfo || "{}");
        groupInfo.presentation = JSON.parse(groupInfo.presentation || "[]");

        setRoom(groupInfo);
      } else {
        window.location.href = "/rooms";
      }
    } catch (e) {
      console.log(e);
      window.location.href = "/rooms";
    }
  };

  useEffect(() => {
    getInfoOfGroup();
  }, [user]);

  const handleUpgradeRole = async (member, isUpgrade) => {
    try {
      const data = {
        memberId: member?._id,
        groupId: room?._id,
        isUpgrade,
      };
      await updateRoleInRoom(data);
      await customToast("SUCCESS", "Update role successfully!");
      router.reload();
    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteRoomById(room?._id);
      await customToast("SUCCESS", `Delete room ${room.name} successfully!`);
      setOpenConfirmDelete(false);
      window.location.href = "/rooms";
    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
      setOpenConfirmDelete(false);
    }
  };

  const [value, setValue] = React.useState(router?.query?.tab || "recordings");

  const handleChange = (e, value) => {
    e.preventDefault();
    router.push({
      pathname: `/rooms/${room?._id}`,
      query: { tab: value },
    });
    setValue(value);
  };

  return (
    <div className={styles.wrapper}>
      {room && (
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ background: "#fff" }}>
            <Container maxWidth="xl" className={styles.roomHeader}>
              <div>
                <h1>{room?.name}</h1>
                <p>Last session: {formatTime(room.meetingInfo.startTime)}</p>
              </div>

              <div className={styles.roomHeaderBtn}>
                <CopyToClipboard
                  text={`${window?.location?.host}/join?meetingID=${room._id}&meetingName=${room.name}`}
                  onCopy={() => toast.success("Copied join url")}
                >
                  <Button variant="outlined" color="primary" startIcon={<ContentCopyIcon />} sx={{ marginRight: 2 }}>
                    Copy join link
                  </Button>
                </CopyToClipboard>

                <Button
                  onClick={async () => {
                    await handleJoinMeeting({ room, user });
                    getUser();
                  }}
                  variant="contained"
                  color="primary"
                  startIcon={<VideoCameraFrontIcon />}
                >
                  {isOwner ? "Start" : "Join"} meeting
                </Button>
              </div>
            </Container>
          </Grid>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", background: "#fff" }}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Container maxWidth="xl">
                    <TabList onChange={handleChange} textColor="primary" indicatorColor="primary">
                      <Tab label="Recordings" value="recordings" />
                      <Tab label="Presentation" value="presentation" />
                      {isOwner && (
                        <>
                          <Tab label="Learning dashboard" value="learningDashboard" />
                          <Tab label="Access" value="access" />
                          <Tab label="Settings" value="setting" />
                        </>
                      )}
                    </TabList>
                  </Container>
                </Box>
                <TabPanel value="recordings" className={styles.tabPanel}>
                  <Grid item xs={12}>
                    <RoomRecordings room={room} isOwner={isOwner} />
                  </Grid>
                </TabPanel>
                <TabPanel value="presentation" className={styles.tabPanel}>
                  <InsertDocuments room={room} getUser={getUser} isOwner={isOwner} />
                </TabPanel>
                {isOwner && (
                  <>
                    <TabPanel value="learningDashboard" className={styles.tabPanel}>
                      <LearningDashboards room={room} />
                    </TabPanel>
                    <TabPanel value="access" className={styles.tabPanel}>
                      <RoomAccess room={room} user={user} getUser={getUser} />
                    </TabPanel>
                    <TabPanel value="setting" className={styles.tabPanel}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setOpenConfirmDelete(true)}
                        startIcon={<DeleteForeverIcon />}
                        style={{ marginLeft: "20px" }}
                      >
                        Delete Room
                      </Button>
                    </TabPanel>
                  </>
                )}
              </TabContext>
            </Box>
          </Grid>

          <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
            <DialogTitle id="alert-dialog-title">Delete this room?</DialogTitle>

            <DialogActions>
              <Button variant="outlined" onClick={() => setOpenConfirmDelete(false)}>
                Cancel
              </Button>
              <Button color="error" variant="contained" type="submit" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </div>
  );
};

export default withLogin(RoomDetailPage);
