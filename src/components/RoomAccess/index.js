import { yupResolver } from "@hookform/resolvers/yup";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { addUserToRoom, removeUserFromRoom } from "src/client/room";
import { isValid } from "src/utils";
import * as yup from "yup";
import styles from "./styles.module.scss";

export default function RoomAccess({ room, getUser }) {
  const isOwner = !!room?.isOwner;
  const [openInviteMemberForm, setOpenInviteMemberForm] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email("User's email is invalid").required("User's email is required"),
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const handleInviteMember = async (data) => {
    try {
      const submitData = {
        userEmail: data.email,
        roomId: room._id,
      };

      const res = await addUserToRoom(submitData);

      if (isValid(res)) {
        toast.success("Add user to room successfully");
        getUser();
        reset();
      }

      setOpenInviteMemberForm(false);
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  };

  const handleRemoveMember = async (member) => {
    try {
      const submitData = {
        userEmail: member.email,
        roomId: room._id,
      };

      const res = await removeUserFromRoom(submitData);

      if (isValid(res)) {
        toast.success("Remove user from room successfully");
        getUser();
        reset();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  };

  return (
    <Container maxWidth="xl">
      {room?.isOwner && (
        <>
          <Dialog open={openInviteMemberForm} onClose={() => setOpenInviteMemberForm(false)} fullWidth>
            <form onSubmit={handleSubmit(handleInviteMember)}>
              <DialogTitle>Add user to room</DialogTitle>
              <DialogContent style={{ overflowY: "initial" }}>
                <TextField
                  label="User's email"
                  placeholder="Enter user's email"
                  {...register("email")}
                  type="email"
                  required
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </DialogContent>
              <DialogActions>
                <Button variant="outlined" onClick={() => setOpenInviteMemberForm(false)}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Add
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenInviteMemberForm(true)}
              startIcon={<PersonAddIcon />}
              sx={{ marginLeft: "auto", mb: 2, mt: 4 }}
            >
              Add user
            </Button>
          </div>
        </>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className={"tableHead"}>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
              {isOwner && <TableCell align="left">Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={room?.ownerId} className={styles.ownerRow}>
              <TableCell align="left">{room?.owner?.name}</TableCell>
              <TableCell align="left">{room?.owner?.email}</TableCell>
              <TableCell align="left">MODERATOR</TableCell>
              {isOwner && (
                <TableCell align="left">
                  <Tooltip title="Add new member">
                    <IconButton onClick={() => setOpenInviteMemberForm(true)}>
                      <PersonAddIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>

            {room?.members?.map((member) => (
              <TableRow key={member?._id} className={styles.memberRow}>
                <TableCell align="left">{member?.name}</TableCell>
                <TableCell align="left">{member?.email}</TableCell>
                <TableCell align="left">ATTENDEE</TableCell>
                {isOwner && (
                  <TableCell align="left">
                    <Tooltip title="Remove this member">
                      <IconButton color="error" onClick={() => handleRemoveMember(member)}>
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
    </Container>
  );
}
