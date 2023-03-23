import CoPresentIcon from "@mui/icons-material/CoPresent";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import { Button, Grid, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createPresentation } from "../../client/presentation";
import { customToast } from "../../utils";
import styles from "./styles.module.scss";

const Presentation = ({ user, getUser }) => {
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: { name: "" },
  });

  const [openCreatePresentationForm, setOpenCreatePresentation] = useState(false);
  const [openJoinGroupForm, setOpenJoinGroupForm] = useState(false);

  const handleCreatePresentation = async (data) => {
    const { name = "", groupId = "" } = data;
    try {
      const res = await createPresentation({ name, groupId, history: [] });
      if (res?.status === "OK") {
        await customToast("SUCCESS", "Create presentation successfully!");
        await getUser();
      } else {
        await customToast("ERROR", res?.message);
      }
    } catch (e) {
      await customToast("ERROR", e?.response?.data?.message);
    }
    setOpenCreatePresentation(false);
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
          onClick={() => setOpenCreatePresentation(true)}
          variant="contained"
          startIcon={<PresentToAllIcon />}
          sx={{ margin: "0 0 20px 20px" }}
        >
          Create new presentation
        </Button>

        <Button
          className="custom-button-outlined"
          onClick={() => setOpenJoinGroupForm(true)}
          variant="outlined"
          startIcon={<CoPresentIcon />}
          sx={{ margin: "0 0 20px 20px" }}
        >
          Join a presentation
        </Button>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>My Presentations</h1>
        <div>
          {user?.presentationIds.length > 0 ? (
            <Grid container spacing={3}>
              {user?.myPresentations?.map((presentation) => (
                <>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={3}
                    xl={3}
                    key={presentation?._id}
                  >
                    <Link
                      href={`/presentation/${presentation?._id}`}
                      legacyBehavior
                    >
                      <a>
                        <div className={styles.card}>
                          <span>{presentation?.name}</span>
                        </div>
                      </a>
                    </Link>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : (
            <p className={styles.emptyText}>
              You have not created any presentation.&nbsp;
              <a
                onClick={() => setOpenCreatePresentation(true)}
                style={{ cursor: "pointer", color: "#1976d2" }}
              >
                Create now!
              </a>
            </p>
          )}
        </div>
      </Grid>

      <Grid item xs={12} className={styles.groupWrapper}>
        <h1>Collab Presentations</h1>
        <div>
          {user?.collabPresentations.length > 0 ? (
            <Grid container spacing={3}>
              {user?.collabPresentations?.map((presentation) => (
                <>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={3}
                    xl={3}
                    key={presentation?._id}
                  >
                    <Link
                      href={`/presentation/${presentation?._id}`}
                      legacyBehavior
                    >
                      <a>
                        <div className={styles.card}>
                          <span>{presentation?.name}</span>
                        </div>
                      </a>
                    </Link>
                  </Grid>
                </>
              ))}
            </Grid>
          ) : (
            <p className={styles.emptyText}>
              You have not collaborated with any presentation.&nbsp;
            </p>
          )}
        </div>
      </Grid>

      <Dialog
        open={openCreatePresentationForm}
        onClose={() => setOpenCreatePresentation(false)}
        style={{ width: "100%" }}
      >
        <form onSubmit={handleSubmit(handleCreatePresentation)}>
          <DialogTitle id="alert-dialog-title">
            Create new presentation
          </DialogTitle>
          <DialogContent className={styles.groupContent}>
            <TextField
              label="Presentation's name"
              placeholder="Enter presentation's name"
              {...register("name")}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="custom-button-outlined"
              variant="outlined"
              onClick={() => setOpenCreatePresentation(false)}
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
            Enter invite link to join presentation
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

export default Presentation;
