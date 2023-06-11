import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PeopleIcon from "@mui/icons-material/People";
import Person2Icon from "@mui/icons-material/Person2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Container, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createInviteLinkRoom, deleteRoomById, getRoomDetail, removeFromRoom, sendInviteEmail, updateRoleInRoom } from "src/client/room";
import { getUserByIds } from "src/client/user";
import { withLogin } from "src/components/HOC/withLogin";
import InsertDocuments from "src/components/InsertDocuments";
import LearningDashboards from "src/components/LearningDashboard";
import RoomRecordings from "src/components/RoomRecordings";
import { AuthContext } from "src/context/authContext";
import { handleJoinMeeting } from "src/service";
import { customToast, formatTime, getFirst, isValid } from "src/utils";
import styles from "./styles.module.scss";

const RoomDetailPage = () => {
  const [room, setRoom] = useState(null);
  const router = useRouter();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { user } = useContext(AuthContext);

  const [anchorElButton, setAnchorElButton] = React.useState(null);

  const { register, handleSubmit, errors } = useForm({
    mode: "onChange",
  });

  const [openInviteMemberForm, setOpenInviteMemberForm] = useState(false);

  const handleInviteMember = async (data) => {
    try {
      const inviteLink = await getInviteLink(room?._id);
      const submitData = {
        email: data.memberEmail,
        ownerName: room?.owner?.name,
        link: inviteLink,
      };

      const res = await sendInviteEmail(submitData);

      if (res?.status === "OK") {
        await customToast("SUCCESS", "Invite link has been sent!");
      }

      setOpenInviteMemberForm(false);
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
      setOpenInviteMemberForm(false);
    }
  };

  const getInviteLink = async (id) => {
    try {
      const inviteLinkRes = await createInviteLinkRoom({ groupId: id });
      if (inviteLinkRes?.status === "OK") {
        const { code = "", groupId = "" } = inviteLinkRes?.data[0];
        const inviteLink = window.location.origin + "/invite?" + "groupId=" + groupId + "&code=" + code;
        return inviteLink;
      }
    } catch (e) {
      return "";
    }
  };

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
  }, []);

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

  const handleRemove = async (member) => {
    try {
      const data = { userId: member?._id, groupId: room?._id };
      await removeFromRoom(data);
      await customToast("SUCCESS", `Remove member ${member.name} successfully!`);
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
    // router.push(
    //   {
    //     pathname: `/rooms/${room?._id}`,
    //     query: { tab: value },
    //   },
    //   undefined,
    //   { shallow: false },
    // );
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
                  onClick={() => handleJoinMeeting({ data: { password: user?._id, fullName: user?.name, role: "moderator" }, room, user })}
                  variant="contained"
                  color="primary"
                  startIcon={<VideoCameraFrontIcon />}
                >
                  Start meeting
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
                      <Tab label="Learning dashboard" value="learningDashboard" />
                      <Tab label="Access" value="access" />
                      <Tab label="Settings" value="setting" />
                    </TabList>
                  </Container>
                </Box>
                <TabPanel value="recordings" className={styles.tabPanel}>
                  <Grid item xs={12}>
                    <RoomRecordings room={room} />
                  </Grid>
                </TabPanel>
                <TabPanel value="presentation" className={styles.tabPanel}>
                  <InsertDocuments room={room} />
                </TabPanel>
                <TabPanel value="learningDashboard" className={styles.tabPanel}>
                  <LearningDashboards room={room} />
                </TabPanel>
                <TabPanel value="access" className={styles.tabPanel}>
                  Access
                  <Grid item xs={12}>
                    <h2 style={{ marginBottom: 10 }}>MEMBERS</h2>

                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead className={styles.tableHead}>
                          <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Role</TableCell>
                            {user?._id === room?.ownerId && <TableCell align="center">Action</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={room?.ownerId} className={styles.ownerRow}>
                            <TableCell align="center">{room?.owner?.name}</TableCell>
                            <TableCell align="center">{room?.owner?.email}</TableCell>
                            <TableCell align="center">OWNER</TableCell>
                            {user?._id === room?.ownerId && (
                              <TableCell align="center">
                                <Tooltip title="Add new member">
                                  <IconButton onClick={() => setOpenInviteMemberForm(true)}>
                                    <PersonAddIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            )}
                          </TableRow>

                          {room?.coOwners?.map((coOwner) => (
                            <TableRow key={coOwner?._id} className={styles.coOwnerRow}>
                              <TableCell align="center">{coOwner?.name}</TableCell>
                              <TableCell align="center">{coOwner?.email}</TableCell>
                              <TableCell align="center">CO OWNER</TableCell>
                              {user?._id === room?.ownerId && (
                                <TableCell align="center">
                                  <Tooltip title="Become member">
                                    <IconButton
                                      color="secondary"
                                      onClick={() => handleUpgradeRole(coOwner, false)}
                                      style={{
                                        marginRight: "10px",
                                      }}
                                    >
                                      <Person2Icon />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Kick this co-owner out">
                                    <IconButton color="error" onClick={() => handleRemove(coOwner)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}

                          {room?.members?.map((member) => (
                            <TableRow key={member?._id} className={styles.memberRow}>
                              <TableCell align="center">{member?.name}</TableCell>
                              <TableCell align="center">{member?.email}</TableCell>
                              <TableCell align="center">MEMBER</TableCell>
                              {user?._id === room?.ownerId && (
                                <TableCell align="center">
                                  <Tooltip title="Become co-owner">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleUpgradeRole(member, true)}
                                      style={{
                                        marginRight: "10px",
                                      }}
                                    >
                                      <PeopleIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Kick this member out">
                                    <IconButton color="error" onClick={() => handleRemove(member)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </TabPanel>
                <TabPanel value="setting" className={styles.tabPanel}>
                  Settings
                  <Button
                    variant="outlined"
                    color="error"
                    ref={anchorElButton}
                    onClick={() => setOpenConfirmDelete(true)}
                    startIcon={<DeleteForeverIcon />}
                    style={{ marginLeft: "20px" }}
                  >
                    Delete Room
                  </Button>
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>

          <Dialog open={openInviteMemberForm} onClose={() => setOpenInviteMemberForm(false)} style={{ width: "100%" }}>
            <form onSubmit={handleSubmit(handleInviteMember)}>
              <DialogTitle id="alert-dialog-title">Invite a member by email</DialogTitle>
              <DialogContent style={{ overflowY: "initial" }}>
                <TextField
                  label="Member's email"
                  placeholder="Enter member's email"
                  {...register("memberEmail")}
                  type="email"
                  required
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={() => setOpenInviteMemberForm(false)}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Invite
                </Button>
              </DialogActions>
            </form>
          </Dialog>
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
