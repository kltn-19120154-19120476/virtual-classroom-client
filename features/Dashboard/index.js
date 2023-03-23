import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { Button, Grid, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createGroup } from "../../client/group";
import { customToast } from "../../utils";
import styles from "./styles.module.scss";

const Dashboard = ({ user, getUser }) => {
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });
  const [openCreateGroupForm, setOpenCreateGroupForm] = useState(false);
  const [openJoinGroupForm, setOpenJoinGroupForm] = useState(false);

  const handleCreateGroup = async (data) => {
    try {
      const res = await createGroup(data);
      if (res?.status === "OK") {
        await customToast("SUCCESS", "Create group successfully!");
        await getUser();
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
    setOpenCreateGroupForm(false);
  };
  const handleJoinGroup = async (data) => {
    window.location.href = data.link;
    setOpenJoinGroupForm(false);
  };

  return (
    <Grid container spacing={6} className={styles.wrapper}>
      <Grid item xs={12} className={styles.actionButtonWrapper}>
        <Button
          className="custom-button"
          onClick={() => setOpenCreateGroupForm(true)}
          variant="contained"
          startIcon={<GroupAddIcon />}
          sx={{ margin: "0 0 20px 20px" }}
        >
          Create new group
        </Button>

        <Button
          className="custom-button"
          onClick={() => setOpenJoinGroupForm(true)}
          variant="contained"
          startIcon={<GroupsIcon />}
          sx={{ margin: "0 0 20px 20px" }}
        >
          Join a group
        </Button>

        <Link href="/presentation">
          <Button
            className="custom-button-outlined"
            variant="outlined"
            startIcon={<SlideshowIcon />}
            sx={{ margin: "0 0 20px 20px" }}
          >
            Presentation
          </Button>
        </Link>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>My Groups</h1>
        <div>
          {user?.myGroupIds.length > 0 ? (
            <Grid container spacing={3}>
              {user?.myGroups?.map((group) => (
                <>
                  <Grid item xs={12} md={6} lg={3} xl={3} key={group?._id}>
                    <Link href={`/group/${group?._id}`}>
                      <div className={styles.card}>
                        <span>{group?.name}</span>
                      </div>
                    </Link>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : (
            <p className={styles.emptyText}>
              You have not created any group.&nbsp;
              <a
                onClick={() => setOpenCreateGroupForm(true)}
                style={{ cursor: "pointer", color: "#1976d2" }}
              >
                Create now!
              </a>
            </p>
          )}
        </div>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>Groups that you are Co-owner</h1>

        {user?.coOwnerGroups.length > 0 ? (
          <Grid container spacing={3}>
            {user.coOwnerGroups.map((group) => (
              <Grid item xs={12} md={6} lg={3} xl={3} key={group?._id}>
                <Link href={`/group/${group?._id}`}>
                  <div className={styles.card}>
                    <span>{group?.name}</span>
                  </div>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p className={styles.emptyText}>
            You are not a co-owner of any group.&nbsp;
            <a
              onClick={() => setOpenJoinGroupForm(true)}
              style={{ cursor: "pointer", color: "#1976d2" }}
            >
              Join a group now!
            </a>
          </p>
        )}
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>Groups that you are member</h1>

        {user?.memberGroups?.length > 0 ? (
          <Grid container spacing={3}>
            {user.memberGroups.map((group) => (
              <Grid item xs={12} md={6} lg={3} xl={3} key={group?._id}>
                <Link href={`/group/${group?._id}`}>
                  <div className={styles.card}>
                    <span>{group?.name}</span>
                  </div>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <p className={styles.emptyText}>
            You are not a member of any group.&nbsp;
            <a
              onClick={() => setOpenJoinGroupForm(true)}
              style={{ cursor: "pointer", color: "#1976d2" }}
            >
              Join a group now!
            </a>
          </p>
        )}
      </Grid>

      <Dialog
        open={openCreateGroupForm}
        onClose={() => setOpenCreateGroupForm(false)}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <DialogTitle id="alert-dialog-title">Create new group</DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField
              label="Group's name"
              placeholder="Enter group's name"
              {...register("name")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="custom-button-outlined"
              variant="outlined"
              onClick={() => setOpenCreateGroupForm(false)}
            >
              Cancel
            </Button>
            <Button className="custom-button" variant="contained" type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={openJoinGroupForm}
        onClose={() => setOpenJoinGroupForm(false)}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(handleJoinGroup)}>
          <DialogTitle id="alert-dialog-title">
            Enter invite link to join group
          </DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField
              label="Invite link"
              placeholder="Enter invite link"
              {...register("link")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="custom-button-outlined"
              variant="outlined"
              onClick={() => setOpenJoinGroupForm(false)}
            >
              Cancel
            </Button>
            <Button className="custom-button" variant="contained" type="submit">
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
};

export default Dashboard;
