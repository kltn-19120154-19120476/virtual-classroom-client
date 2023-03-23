import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addCollaborator, getPresentationDetail, removeFromPresentation, deletePresentation } from "../../../client/presentation";
import { getUserByIds } from "../../../client/user";
import Breadcrumb from "../../../components/Breadcrumb";
import LoadingScreen from "../../../components/LoadingScreen";
import { AuthContext } from "../../../context/authContext";
import { customToast } from "../../../utils";
import styles from "./styles.module.scss";

export default function GroupDetailPage() {
  const [presentation, setPresentation] = useState(null);
  const router = useRouter();
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const { user, isLoadingAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit } = useForm({
    mode: "onChange",
  });
  const [openInviteCollaboratorForm, setOpenInviteCollaboratorForm] = useState(false);

  const handleInviteCollaborator = async (data) => {
    try {
      const res = await addCollaborator({
        collaboratorEmail: data.collaboratorEmail,
        presentationId: presentation._id,
        userId: presentation.ownerId,
      });

      if (res?.status === "OK") {
        await customToast("SUCCESS", "Add collaborator successfully!");
        setOpenInviteCollaboratorForm(false);
        router.reload();
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
  };

  const getInfoOfPresentation = async () => {
    try {
      const res = await getPresentationDetail(router.query.id);
      if (res.status === "OK") {
        let presentationInfo = res.data[0];

        if (presentationInfo?.ownerId !== user?._id) {
          router.back();
        }

        const userListRes = await getUserByIds([presentationInfo.ownerId, ...presentationInfo.collaborators]);
        const userListMap = {};

        userListRes?.data?.forEach((user) => (userListMap[user?._id] = user));

        presentationInfo.collaborators = presentationInfo.collaborators.map((code) => userListMap[code]);

        presentationInfo = {
          ...presentationInfo,
          owner: userListMap[presentationInfo.ownerId],
        };

        setPresentation(presentationInfo);
      } else {
        await customToast("ERROR", "Presentation not found!");
        router.push("/presentation");
      }
    } catch (e) {
      router.push("/presentation");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInfoOfPresentation();
  }, []);

  const handleRemove = async (collaborator) => {
    try {
      const data = {
        userId: presentation?.ownerId,
        presentationId: presentation?._id,
        collaboratorId: collaborator?._id,
      };
      const res = await removeFromPresentation(data);
      if (res?.status === "OK") {
        await customToast("SUCCESS", `Remove collaborator ${collaborator.name} successfully!`);
        router.reload();
      } else {
        await customToast("ERROR", e.response?.data?.message);
      }
    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
    }
  };

  const handleDeletePresentation = async () => {
    try {
      const { id } = router.query;
      const res = await deletePresentation(id);
      if (res?.status === "OK") {
        await customToast("SUCCESS", `Remove presentation ${presentation.name} successfully!`);
        window.location.href = "/presentation";
      } else {
        await customToast("ERROR", e.response?.data?.message);
      }
    } catch (e) {
      await customToast("ERROR", e.response?.data?.message);
    }
  };

  return isLoading || isLoadingAuth || !user ? (
    <LoadingScreen />
  ) : (
    <Grid container spacing={6} className={styles.wrapper}>
      <Breadcrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "Presentation", href: "/presentation" },
          {
            label: presentation?.name,
            href: `/presentation/${presentation?._id}`,
          },
        ]}
      />
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button className="custom-button" variant="contained" onClick={() => setOpenInviteCollaboratorForm(true)} startIcon={<PersonAddIcon />}>
          Add a collaborator
        </Button>
        <Button sx={{ marginLeft: "15px" }} variant="outlined" color="error" onClick={() => setOpenConfirmDelete(true)} startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Grid>
      <Grid item xs={12}>
        <h1 style={{ textAlign: "center" }}>{presentation?.name}</h1>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                {user?._id === presentation?.ownerId && <TableCell align="center">Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={presentation?.ownerId} className={styles.ownerRow}>
                <TableCell align="center">{presentation?.owner?.name}</TableCell>
                <TableCell align="center">{presentation?.owner?.email}</TableCell>
                <TableCell align="center">OWNER</TableCell>
                <TableCell align="center">
                  <Tooltip title="Add new collaborator">
                    <IconButton onClick={() => setOpenInviteCollaboratorForm(true)}>
                      <PersonAddIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>

              {presentation?.collaborators?.map((collaborator) => (
                <TableRow key={collaborator?._id} className={styles.memberRow}>
                  <TableCell align="center">{collaborator?.name}</TableCell>
                  <TableCell align="center">{collaborator?.email}</TableCell>
                  <TableCell align="center">COLLABORATOR</TableCell>
                  <TableCell align="center">
                    {user?._id === presentation?.ownerId && (
                      <Tooltip title="Remove collaborator">
                        <IconButton color="error" onClick={() => handleRemove(collaborator)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={openInviteCollaboratorForm} onClose={() => setOpenInviteCollaboratorForm(false)} style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(handleInviteCollaborator)}>
          <DialogTitle id="alert-dialog-title">Invite a collaborator by email</DialogTitle>
          <DialogContent style={{ overflowY: "initial" }}>
            <TextField label="Collaborator's email" placeholder="Enter collaborator's email" {...register("collaboratorEmail")} type="email" required fullWidth />
          </DialogContent>
          <DialogActions>
            <Button className="custom-button-outlined" variant="outlined" onClick={() => setOpenInviteCollaboratorForm(false)}>
              Cancel
            </Button>
            <Button className="custom-button" variant="contained" type="submit">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle id="alert-dialog-title">Please confirm to delete this presentation</DialogTitle>
        <DialogActions>
          <Button className="custom-button-outlined" variant="outlined" onClick={() => setOpenConfirmDelete(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDeletePresentation}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
