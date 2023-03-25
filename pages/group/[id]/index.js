import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PeopleIcon from "@mui/icons-material/People";
import Person2Icon from "@mui/icons-material/Person2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import {
    Button,
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
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    createBBBClass,
    endMeeting,
    getMeetingInfo,
    joinBBBClass,
} from "../../../client/bbb-client";
import {
    createInviteLinkGroup,
    deleteGroupById,
    getGroupDetail,
    removeFromGroup,
    sendInviteEmail,
    updateRoleInGroup,
} from "../../../client/group";
import { getPresentationByIds } from "../../../client/presentation";
import { getUserByIds } from "../../../client/user";
import Breadcrumb from "../../../components/Breadcrumb";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../context/authContext";
import { SocketContext } from "../../../context/socketContext";
import { customToast } from "../../../utils";
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

                const [userListRes, presentationListRes] = await Promise.all([
                    getUserByIds([
                        groupInfo.ownerId,
                        ...groupInfo.memberIds,
                        ...groupInfo.coOwnerIds,
                    ]),
                    getPresentationByIds([]),
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

    return isLoading || isLoadingAuth || !user ? (
        <LoadingScreen />
    ) : (
        <Grid container spacing={6} className={styles.wrapper}>
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
            <Grid item xs={12}>
                <Button
                    onClick={() =>
                        createBBBClass({
                            meetingID: group?._id,
                            recordID: group?._id,
                            name: group?._id,
                            attendeePW: "123at",
                            moderatorPW: "123mo",
                            fullName: group?.owner?.name,
                        })
                    }
                    variant="contained"
                >
                    Create meeting
                </Button>

                <Button
                    onClick={() =>
                        joinBBBClass({
                            meetingID: group?._id,
                            password: "123mo",
                            fullName: user?.name,
                        })
                    }
                    variant="contained"
                >
                    Join meeting as moderator
                </Button>

                <Button
                    onClick={() =>
                        joinBBBClass({
                            meetingID: group?._id,
                            password: "123at",
                            fullName: user?.name,
                        })
                    }
                    variant="contained"
                >
                    Join meeting as attendee
                </Button>

                <Button
                    onClick={() =>
                        getMeetingInfo({
                            meetingID: group?._id,
                            password: "123mo",
                        })
                    }
                    variant="contained"
                >
                    Get meeting info
                </Button>

                <Button
                    onClick={() =>
                        endMeeting({
                            meetingID: group?._id,
                            password: "123mo",
                        })
                    }
                    variant="contained"
                >
                    End meeting
                </Button>
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
                                        window.location.href = `/presentation/${group.currentPresentation._id}/slideshow`;
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
