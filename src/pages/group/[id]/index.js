import {
    CloseOutlined,
    DocumentScannerRounded,
    PersonAdd,
    LocalLibrary,
} from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PeopleIcon from "@mui/icons-material/People";
import Person2Icon from "@mui/icons-material/Person2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import {
    Button,
    Card,
    Chip,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Tooltip,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InsertDocumentsForm from "src/components/InsertDocumentsForm";
import JoinMeetingForm from "src/components/JoinMeetingForm";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    createBBBClass,
    endMeeting,
    getMeetingInfo,
    insertDocument,
    joinBBBClass,
    getLearningDashboard,
} from "src/client/bbb-client";
import {
    createInviteLinkGroup,
    deleteGroupById,
    getGroupDetail,
    removeFromGroup,
    sendInviteEmail,
    updateRoleInGroup,
} from "src/client/group";
import { getPresentationByIds } from "src/client/presentation";
import { getUserByIds } from "src/client/user";
import Breadcrumb from "src/components/Breadcrumb";
import CreateMeetingForm from "src/components/CreateMeetingForm";
import LoadingScreen from "src/components/LoadingScreen";
import { AuthContext } from "src/context/authContext";
import { SocketContext } from "src/context/socketContext";
import { customToast, getLinkWithPrefix } from "src/utils";
import styles from "./styles.module.scss";

export default function GroupDetailPage() {
    const [group, setGroup] = useState(null);
    const [inviteLink, setInviteLink] = useState("");
    const router = useRouter();
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
    const { user, isLoadingAuth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    const { socket } = useContext(SocketContext);

    const [anchorElButton, setAnchorElButton] = React.useState(null);
    const openMenu = Boolean(anchorElButton);
    const handleClickButton = (event) => {
        setAnchorElButton(event.currentTarget);
    };

    const { register, handleSubmit, errors } = useForm({
        mode: "onChange",
    });

    const [openInviteMemberForm, setOpenInviteMemberForm] = useState(false);

    const [meetingInfo, setMeetingInfo] = useState({});

    const handleInviteMember = async (data) => {
        try {
            const inviteLink = await getInviteLink(group?._id);
            const submitData = {
                email: data.memberEmail,
                ownerName: group?.owner?.name,
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
            const inviteLinkRes = await createInviteLinkGroup({ groupId: id });
            if (inviteLinkRes?.status === "OK") {
                const { code = "", groupId = "" } = inviteLinkRes?.data[0];
                const inviteLink =
                    window.location.origin +
                    "/invite?" +
                    "groupId=" +
                    groupId +
                    "&code=" +
                    code;
                return inviteLink;
            }
        } catch (e) {
            return "";
        }
    };

    const getInfoOfGroup = async () => {
        try {
            const res = await getGroupDetail(router.query.id);
            if (res.status === "OK") {
                const groupInfo = res.data[0];

                if (user?._id === groupInfo.ownerId) {
                    const inviteLink = await getInviteLink(groupInfo?._id);
                    if (inviteLink) setInviteLink(inviteLink);
                }

                const [userListRes, presentationListRes, meetingInfoRes] =
                    await Promise.all([
                        getUserByIds([
                            groupInfo.ownerId,
                            ...groupInfo.memberIds,
                            ...groupInfo.coOwnerIds,
                        ]),
                        getPresentationByIds([]),
                        getMeetingInfo({
                            meetingID: groupInfo?._id,
                            password: user?._id,
                        }),
                    ]);

                const userListMap = {};

                userListRes?.data?.forEach(
                    (user) => (userListMap[user?._id] = user),
                );

                groupInfo.owner = userListMap[groupInfo.ownerId];
                groupInfo.members = groupInfo.memberIds.map(
                    (id) => userListMap[id],
                );
                groupInfo.coOwners = groupInfo.coOwnerIds.map(
                    (id) => userListMap[id],
                );
                groupInfo.total =
                    groupInfo.memberIds.length +
                    groupInfo.coOwnerIds.length +
                    1;

                groupInfo.currentPresentation = presentationListRes?.data?.find(
                    (presentation) => presentation.groupId === groupInfo._id,
                );

                setGroup(groupInfo);

                if (meetingInfoRes?.returncode === "SUCCESS")
                    setMeetingInfo(meetingInfoRes);

                setIsLoading(false);
            } else {
                router.push("/");
            }
        } catch (e) {
            router.push("/");
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getInfoOfGroup();
    }, []);

    useEffect(() => {
        socket.on("startPresent", (data) => {
            if (data.presentationId === group?.currentPresentation?._id)
                router.reload();
        });

        socket.on("stopPresent", (data) => {
            if (data === group?.currentPresentation?._id) router.reload();
        });

        socket.on("stopPresentByUpdateGroup", (data) => {
            if (data?.find((p) => p._id === group?.currentPresentation?._id))
                router.reload();
        });
    }, [group]);

    const handleUpgradeRole = async (member, isUpgrade) => {
        try {
            const data = {
                memberId: member?._id,
                groupId: group?._id,
                isUpgrade,
            };
            await updateRoleInGroup(data);
            await customToast("SUCCESS", "Update role successfully!");
            router.reload();
        } catch (e) {
            await customToast("ERROR", e.response?.data?.message);
        }
    };

    const handleRemove = async (member) => {
        try {
            const data = { userId: member?._id, groupId: group?._id };
            await removeFromGroup(data);
            await customToast(
                "SUCCESS",
                `Remove member ${member.name} successfully!`,
            );
            router.reload();
        } catch (e) {
            await customToast("ERROR", e.response?.data?.message);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            // const data = { userId: member?._id, groupId: group?._id };
            await deleteGroupById(group?._id);
            await customToast(
                "SUCCESS",
                `Delete group ${group.name} successfully!`,
            );
            setOpenConfirmDelete(false);
            router.reload();
        } catch (e) {
            await customToast("ERROR", e.response?.data?.message);
            setOpenConfirmDelete(false);
        }
    };

    const [openCreateMeetingForm, setOpenCreateMeetingForm] = useState(false);
    const [openJoinMeetingForm, setOpenJoinMeetingForm] = useState(false);
    const [openInsertDocumentsForm, setOpenInsertDocumentsForm] =
        useState(false);

    const handleCreateMeeting = async (data, fileUpload) => {
        const res = await createBBBClass(
            {
                meetingID: group?._id,
                recordID: group?._id,
                moderatorPW: group?.owner?._id,
                fullName: group?.owner?.name,
                ...data,
            },
            fileUpload,
        );
        if (res?.returncode === "SUCCESS") {
            const meetingInfo = await getMeetingInfo({
                meetingID: res.meetingID,
                password: group?._id,
            });
            setMeetingInfo(meetingInfo);
        }
        customToast("INFO", res?.message);
    };

    const handleJoinMeeting = async (data) => {
        const res = await joinBBBClass({
            meetingID: group?._id,
            ...data,
        });
        customToast("INFO", res?.message);
    };

    const handleUploadDocuments = async (data) => {
        const res = await insertDocument({
            meetingID: group?._id,
            file: data,
        });

        console.log(res);
        customToast("INFO", res?.message);
    };

    return isLoading || isLoadingAuth || !user ? (
        <LoadingScreen />
    ) : (
        <Grid container spacing={6} className={styles.wrapper}>
            <CreateMeetingForm
                handleClose={() => setOpenCreateMeetingForm(false)}
                open={openCreateMeetingForm}
                handleOK={handleCreateMeeting}
            />
            <JoinMeetingForm
                handleClose={() => setOpenJoinMeetingForm(false)}
                open={openJoinMeetingForm}
                handleOK={handleJoinMeeting}
            />
            <InsertDocumentsForm
                handleClose={() => setOpenInsertDocumentsForm(false)}
                open={openInsertDocumentsForm}
                handleOK={handleUploadDocuments}
            />
            <Breadcrumb
                paths={[
                    { label: "Home", href: "/" },
                    { label: group?.name, href: `/group/${group?._id}` },
                ]}
            />
            <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
            >
                <Button
                    className="custom-button"
                    variant="contained"
                    ref={anchorElButton}
                    onClick={handleClickButton}
                    startIcon={<PersonAddIcon />}
                >
                    Invite
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    ref={anchorElButton}
                    onClick={() => setOpenConfirmDelete(true)}
                    startIcon={<DeleteForeverIcon />}
                    style={{ marginLeft: "20px" }}
                >
                    Delete Group
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorElButton}
                    open={openMenu}
                    onClose={() => setAnchorElButton(null)}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                    anchorPosition="left"
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <CopyToClipboard text={inviteLink}>
                        <MenuItem
                            onClick={() => {
                                toast.promise(
                                    async () => {
                                        const newInviteLink =
                                            await getInviteLink(group?._id);
                                        setInviteLink(newInviteLink);
                                    },
                                    {
                                        pending: "Getting invite link...",
                                        success: "Invite link copied!",
                                        error: "Unexpected error",
                                    },
                                );
                                setAnchorElButton(null);
                            }}
                        >
                            <ListItemIcon>
                                <ContentCopyIcon fontSize="small" />
                            </ListItemIcon>
                            Copy invite link
                        </MenuItem>
                    </CopyToClipboard>
                    <MenuItem
                        onClick={() => {
                            setOpenInviteMemberForm(true);
                            setAnchorElButton(null);
                        }}
                    >
                        <ListItemIcon>
                            <SendIcon fontSize="small" />
                        </ListItemIcon>
                        Invite a member
                    </MenuItem>
                </Menu>
            </Grid>
            <Grid item xs={12}>
                <h1 style={{ textAlign: "center" }}>{group?.name}</h1>
            </Grid>
            <Grid
                item
                xs={12}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 20,
                }}
            >
                {meetingInfo?.returncode === "SUCCESS" ? (
                    <Card className={styles.meetingInfoWrapper}>
                        <h2>Current meeting: {meetingInfo.meetingName}</h2>

                        <Grid container spacing={3} maxWidth="sm">
                            <Grid item xs={12} md={6}>
                                {" "}
                                <Button
                                    onClick={async () => {
                                        const joinedMeetingInfo =
                                            await joinBBBClass({
                                                meetingID: group?._id,
                                                password: user?._id,
                                                fullName: user?.name,
                                            });
                                    }}
                                    variant="contained"
                                    color="success"
                                    startIcon={<PersonAdd />}
                                >
                                    Join meeting as moderator
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    onClick={() => setOpenJoinMeetingForm(true)}
                                    variant="contained"
                                    color="warning"
                                    startIcon={<PersonAdd />}
                                >
                                    Join meeting as attendee
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    onClick={() =>
                                        setOpenInsertDocumentsForm(true)
                                    }
                                    variant="contained"
                                    color="info"
                                    startIcon={<DocumentScannerRounded />}
                                >
                                    Insert document
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    onClick={async () => {
                                        const res = await endMeeting({
                                            meetingID: group?._id,
                                            password: user?._id,
                                        });
                                        if (res?.returncode === "SUCCESS")
                                            setMeetingInfo(null);
                                    }}
                                    variant="contained"
                                    color="error"
                                    startIcon={<CloseOutlined />}
                                >
                                    End meeting
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button
                                    onClick={async () => {
                                        const res = await getLearningDashboard({
                                            meeting:
                                                meetingInfo.internalMeetingID,
                                        });
                                        console.log(JSON.parse(res.data));
                                    }}
                                    variant="contained"
                                    color="info"
                                    startIcon={<LocalLibrary />}
                                >
                                    Get learning dashboard
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                ) : (
                    <div>
                        <Button
                            onClick={() => setOpenCreateMeetingForm(true)}
                            variant="contained"
                        >
                            Create meeting
                        </Button>
                    </div>
                )}
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead className={styles.tableHead}>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Role</TableCell>
                                {user?._id === group?.ownerId && (
                                    <TableCell align="center">Action</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                key={group?.ownerId}
                                className={styles.ownerRow}
                            >
                                <TableCell align="center">
                                    {group?.owner?.name}
                                </TableCell>
                                <TableCell align="center">
                                    {group?.owner?.email}
                                </TableCell>
                                <TableCell align="center">OWNER</TableCell>
                                {user?._id === group?.ownerId && (
                                    <TableCell align="center">
                                        <Tooltip title="Add new member">
                                            <IconButton
                                                onClick={() =>
                                                    setOpenInviteMemberForm(
                                                        true,
                                                    )
                                                }
                                            >
                                                <PersonAddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                )}
                            </TableRow>

                            {group?.coOwners?.map((coOwner) => (
                                <TableRow
                                    key={coOwner?._id}
                                    className={styles.coOwnerRow}
                                >
                                    <TableCell align="center">
                                        {coOwner?.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {coOwner?.email}
                                    </TableCell>
                                    <TableCell align="center">
                                        CO OWNER
                                    </TableCell>
                                    {user?._id === group?.ownerId && (
                                        <TableCell align="center">
                                            <Tooltip title="Become member">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() =>
                                                        handleUpgradeRole(
                                                            coOwner,
                                                            false,
                                                        )
                                                    }
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <Person2Icon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Kick this co-owner out">
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemove(coOwner)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}

                            {group?.members?.map((member) => (
                                <TableRow
                                    key={member?._id}
                                    className={styles.memberRow}
                                >
                                    <TableCell align="center">
                                        {member?.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {member?.email}
                                    </TableCell>
                                    <TableCell align="center">MEMBER</TableCell>
                                    {user?._id === group?.ownerId && (
                                        <TableCell align="center">
                                            <Tooltip title="Become co-owner">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleUpgradeRole(
                                                            member,
                                                            true,
                                                        )
                                                    }
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <PeopleIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Kick this member out">
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemove(member)
                                                    }
                                                >
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

            {group?.currentPresentation && (
                <>
                    <Grid item xs={12}>
                        <h1>Current presentations</h1>
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <div className={styles.card}>
                            <span>
                                Name: <b>{group.currentPresentation?.name}</b>
                            </span>
                            <p>
                                Status:{" "}
                                <span>
                                    {group.currentPresentation?.isPresent ? (
                                        <Chip
                                            label="Presenting"
                                            color="success"
                                        />
                                    ) : (
                                        <Chip
                                            label="Not started"
                                            color="error"
                                        />
                                    )}
                                </span>
                            </p>
                            {group.currentPresentation?.isPresent && (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        window.location.href =
                                            getLinkWithPrefix(
                                                `/presentation/${group.currentPresentation._id}/slideshow`,
                                            );
                                    }}
                                >
                                    Join
                                </Button>
                            )}
                        </div>
                    </Grid>
                </>
            )}

            <Dialog
                open={openInviteMemberForm}
                onClose={() => setOpenInviteMemberForm(false)}
                style={{ width: "100%" }}
            >
                <form onSubmit={handleSubmit(handleInviteMember)}>
                    <DialogTitle id="alert-dialog-title">
                        Invite a member by email
                    </DialogTitle>
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
                        <Button
                            className="custom-button"
                            variant="contained"
                            onClick={() => setOpenInviteMemberForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit">
                            Invite
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog
                open={openConfirmDelete}
                onClose={() => setOpenConfirmDelete(false)}
            >
                <DialogTitle id="alert-dialog-title">
                    Please confirm to delete this group
                </DialogTitle>

                <DialogActions>
                    <Button
                        className="custom-button-outlined"
                        variant="outlined"
                        onClick={() => setOpenConfirmDelete(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        type="submit"
                        onClick={handleDeleteGroup}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
