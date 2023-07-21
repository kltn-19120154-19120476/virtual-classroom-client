import { StopCircleSharp } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import { LoadingButton } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Chip, Container, Grid, IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { getRoomDetail } from "src/client/room";
import { getUserByIds } from "src/client/user";
import { withLogin } from "src/components/HOC/withLogin";
import InsertDocuments from "src/components/InsertDocuments";
import LearningDashboards from "src/components/LearningDashboard";
import MeetingSettings from "src/components/MeetingSettings";
import RoomAccess from "src/components/RoomAccess";
import RoomRecordings from "src/components/RoomRecordings";
import { AuthContext } from "src/context/authContext";
import { endMeeting, handleJoinMeeting } from "src/service";
import { getMeetingInviteLink } from "src/service/UserService";
import { formatTime, getFirst, isValid } from "src/utils";
import styles from "./styles.module.scss";

const RoomDetailPage = () => {
  const [room, setRoom] = useState(null);
  const router = useRouter();
  const { user, getUser } = useContext(AuthContext);

  const isOwner = user?._id === room?.ownerId;

  const [meetingLoading, setMeetingLoading] = useState(false);

  const getInfoOfRoom = async () => {
    if (router?.query?.id) {
      try {
        const res = await getRoomDetail(router.query.id);
        if (isValid(res)) {
          let roomInfo = getFirst(res);

          const userListRes = await getUserByIds([roomInfo.ownerId, ...roomInfo.memberIds, ...roomInfo.coOwnerIds]);
          const userListMap = {};

          userListRes?.data?.forEach((user) => (userListMap[user?._id] = user));

          roomInfo = {
            ...roomInfo,
            ...([...(user?.joinedRooms || []), ...(user?.myRooms || [])]?.find((room) => room?._id === roomInfo?._id) || {}),
          };

          roomInfo.owner = userListMap[roomInfo.ownerId];
          roomInfo.members = roomInfo.memberIds.map((id) => userListMap[id]);
          roomInfo.coOwners = roomInfo.coOwnerIds.map((id) => userListMap[id]);
          roomInfo.total = roomInfo.memberIds.length + roomInfo.coOwnerIds.length + 1;
          roomInfo.presentation = JSON.parse(roomInfo.presentation || "[]");

          setRoom(roomInfo);
        } else {
          window.location.href = "/rooms";
        }
      } catch (e) {
        console.log(e);
        window.location.href = "/rooms";
      }
    }
  };

  useEffect(() => {
    getInfoOfRoom();
    setValue(router?.query?.tab || "recordings");
  }, [user]);

  const [value, setValue] = React.useState("recordings");

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
        <Grid container spacing={isMobile ? 4 : 6}>
          <Grid item xs={12} sx={{ background: "#fff" }}>
            <Container maxWidth="xl" className={styles.roomHeader}>
              <div>
                <h1>
                  {room?.name}{" "}
                  <CopyToClipboard
                    text={getMeetingInviteLink(room, user)}
                    onCopy={() => toast.success("Meeting invite link has been copied to clipboard")}
                  >
                    <Tooltip title="Copy meeting invite link">
                      <IconButton>
                        <ContentCopyIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    {/* <Button variant="outlined" color="primary" startIcon={<ContentCopyIcon />} sx={{ marginRight: 2 }}>
                      Copy meeting invite link
                    </Button> */}
                  </CopyToClipboard>{" "}
                </h1>
                <div className={styles.roomState}>
                  {room?.isOwner ? <Chip label="OWNER" color="primary" /> : <Chip label="MEMBER" color="secondary" />}
                  {room?.isMeetingRunning && <Chip label="Running" color="success" />}
                </div>
                <p>Current session: {formatTime(room.meetingInfo?.startTime)}</p>
              </div>

              <div className={styles.roomHeaderBtn}>
                <LoadingButton
                  onClick={async () => {
                    try {
                      setMeetingLoading(true);
                      await handleJoinMeeting({ room, user });
                      setMeetingLoading(false);
                      getUser();
                    } catch (e) {
                      setMeetingLoading(false);
                    }
                  }}
                  loading={meetingLoading}
                  variant="contained"
                  color="primary"
                  startIcon={<VideoCameraFrontIcon />}
                  sx={{ marginRight: room?.isMeetingRunning ? 2 : 0, marginTop: 1 }}
                >
                  {isOwner && !room?.isMeetingRunning ? "Start" : "Join"} meeting
                </LoadingButton>

                {room?.isMeetingRunning && isOwner && (
                  <Button
                    onClick={async () => {
                      try {
                        const res = await endMeeting(user?._id, room?._id);
                        if (isValid(res)) {
                          toast.success("Meeting was ended successfully");
                        }
                        getUser();
                      } catch (e) {}
                    }}
                    variant="contained"
                    color="error"
                    startIcon={<StopCircleSharp />}
                    sx={{ marginTop: 1 }}
                  >
                    End meeting
                  </Button>
                )}
              </div>
            </Container>
          </Grid>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end", background: "#fff" }}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Container maxWidth="xl">
                    <TabList onChange={handleChange} textColor="primary" indicatorColor="primary" variant="scrollable" visibleScrollbar>
                      <Tab label="Recordings" value="recordings" />
                      <Tab label="Presentation" value="presentation" />
                      {isOwner && <Tab label="Learning dashboard" value="learningDashboard" />}
                      <Tab label="Access" value="access" />
                      {isOwner && <Tab label="Settings" value="setting" />}
                    </TabList>
                  </Container>
                </Box>
                <TabPanel value="recordings" className={styles.tabPanel}>
                  <Grid item xs={12}>
                    <RoomRecordings room={room} />
                  </Grid>
                </TabPanel>
                <TabPanel value="presentation" className={styles.tabPanel}>
                  <InsertDocuments room={room} getUser={getUser} />
                </TabPanel>
                {isOwner && (
                  <TabPanel value="learningDashboard" className={styles.tabPanel}>
                    <LearningDashboards room={room} getUser={getUser} user={user} />
                  </TabPanel>
                )}
                <TabPanel value="access" className={styles.tabPanel}>
                  <RoomAccess room={room} getUser={getUser} />
                </TabPanel>
                {isOwner && (
                  <TabPanel value="setting" className={styles.tabPanel}>
                    <MeetingSettings room={room} getUser={getUser} user={user} />
                  </TabPanel>
                )}
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default withLogin(RoomDetailPage);
