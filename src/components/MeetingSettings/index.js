import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteForever } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { deleteRoomById, updateRoom } from "src/client/room";
import { customToast, isValid } from "src/utils";
import * as yup from "yup";
import styles from "./styles.module.scss";

const BBB_BOOLEAN_SETTINGS = [
  {
    key: "record",
    label: "Record",
    description:
      "Setting ‘record=true’ instructs the BigBlueButton server to record the media and events in the session for later playback.",
  },
  {
    key: "autoStartRecording",
    label: "Auto start recording",
    description: "Whether to automatically start recording when first user joins",
  },
  {
    key: "allowStartStopRecording",
    label: "Allow start stop recording",
    description: "Allow the user to start/stop recording",
  },
  {
    key: "webcamsOnlyForModerator",
    label: "Webcam only for moderators",
    description:
      "Setting webcamsOnlyForModerator=true will cause all webcams shared by viewers during this meeting to only appear for moderators",
  },
  {
    key: "muteOnStart",
    label: "Mute on start",
    description: "Setting true will mute all users when the meeting starts",
  },
  {
    key: "allowModsToUnmuteUsers",
    label: "Allow moderators to unmute users",
    description: "Setting to true will allow moderators to unmute other users in the meeting",
  },
  {
    key: "lockSettingsDisableCam",
    label: "Disable camera",
    description: "Setting true will prevent users from sharing their camera in the meeting",
  },
  {
    key: "lockSettingsDisableMic",
    label: "Disable microphone",
    description: "Setting to true will only allow user to join listen only",
  },
  {
    key: "lockSettingsDisablePrivateChat",
    label: "Disable private chat",
    description: "Setting to true will disable private chats in the meeting",
  },
  {
    key: "lockSettingsDisablePublicChat",
    label: "Disable public chat",
    description: "Setting to true will disable public chat in the meeting",
  },
  {
    key: "lockSettingsDisableNotes",
    label: "Disable notes",
    description: "Setting to true will disable notes in the meeting",
  },
  {
    key: "lockSettingsHideUserList",
    label: "Hide users list",
    description: "Setting to true will prevent viewers from seeing other viewers in the user list",
  },
  {
    key: "lockSettingsLockOnJoin",
    label: "Lock on join",
    description: "Setting to false will not apply lock setting to users when they join",
  },
  {
    key: "lockSettingsLockOnJoinConfigurable",
    label: "Lock on join configurable",
    description: "Setting to true will allow applying of lockSettingsLockOnJoin",
  },
  {
    key: "lockSettingsHideViewersCursor",
    label: "Hide viewers cursor",
    description: "Setting to true will prevent viewers to see other viewers cursor when multi-user whiteboard is on",
  },
  {
    key: "meetingKeepEvents",
    label: "Meeting keep events",
    description:
      "Defaults to the value of defaultKeepEvents. If meetingKeepEvents is true BigBlueButton saves meeting events even if the meeting is not recorded",
  },
  {
    key: "endWhenNoModerator",
    label: "End when no moderator",
    description:
      "Default endWhenNoModerator=false. If endWhenNoModerator is true the meeting will end automatically after a delay - see endWhenNoModeratorDelayInMinute",
  },
  {
    key: "allowModsToEjectCameras",
    label: "Allow moderators to eject users cameras",
    description: "Setting to true will allow moderators to close other users cameras in the meeting",
  },
  {
    key: "allowRequestsWithoutSession",
    label: "Allow requests without session",
    description: "Setting to true will allow users to join meetings without session cookie's validation",
  },
  {
    key: "preUploadedPresentationOverrideDefault",
    label: "Pre-uploaded presentation override default",
    description:
      "If it is true, the default.pdf document is not sent along with the other presentations in the /create endpoint, on the other hand, if that's false, the default.pdf is sent with the other documents",
  },
  {
    key: "notifyRecordingIsOn",
    label: "Notify recording is on",
    description:
      "If it is true, a modal will be displayed to collect recording consent from users when meeting recording starts (only if remindRecordingIsOn=true)",
  },
];

const BBB_STRING_SETTINGS = [
  {
    key: "welcome",
    label: "Welcome text",
    description: "A welcome message that gets displayed on the chat window when the participant joins",
  },
  {
    key: "logoutURL",
    label: "Logout URL",
    description:
      "The URL that the BigBlueButton client will go to after users click the OK button on the ‘You have been logged out message’",
  },
  {
    key: "moderatorOnlyMessage",
    label: "Moderator only message",
    description: "Display a message to all moderators in the public chat",
  },
  {
    key: "bannerText",
    label: "Banner text",
    description: "Will set the banner text in the client",
  },
  {
    key: "bannerColor",
    label: "Banner color",
    description: "Will set the banner background color in the client",
  },
  {
    key: "logo",
    label: "Logo",
    description: "Pass a URL to an image which will then be visible in the area",
  },
];

const BBB_NUMERIC_SETTINGS = [
  {
    key: "maxParticipants",
    label: "Maximum number of participants",
    description: "Set the maximum number of users allowed to joined the conference at the same time",
  },
  {
    key: "duration",
    label: "Meeting duration",
    description: "The maximum length (in minutes) for the meeting",
  },
  {
    key: "endWhenNoModeratorDelayInMinutes",
    label: "End when no moderator delay in minutes",
    description: "The meeting will be automatically ended after this many minutes",
  },
  {
    key: "learningDashboardCleanupDelayInMinutes",
    label: "Learning dashboard cleanup delay in minutes",
    description:
      "This option set the delay (in minutes) before the Learning Dashboard become unavailable after the end of the meeting. If this value is zero, the Learning Dashboard will keep available permanently",
  },
  {
    key: "userCameraCap",
    label: "Max number of webcams a single user can share simultaneously",
    description: "efines the max number of webcams a single user can share simultaneously",
  },
  {
    key: "meetingCameraCap",
    label: "Max number of webcams a meeting can have simultaneously",
    description: "Defines the max number of webcams a meeting can have simultaneously",
  },
  {
    key: "meetingExpireIfNoUserJoinedInMinutes",
    label: "Meeting expiration minutes if no user joins",
    description: "Automatically end meeting if no user joined within a period of time after meeting created",
  },
  {
    key: "meetingExpireWhenLastUserLeftInMinutes",
    label: "Meeting expiration minutes when last user left",
    description: "Number of minutes to automatically end meeting after last user left",
  },
];

export default function MeetingSettings({ room, user, getUser }) {
  const router = useRouter();
  const schema = yup.object().shape({
    roomName: yup.string().required("Room name is required"),
    name: yup.string().required("Meeting name is required"),
  });

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const getDefaultSettings = (room) => ({
    name: room?.name,
    roomName: room?.name,
    // attendeePW: "",
    welcome: `Welcome to ${room?.name}`,
    maxParticipants: 100,
    logoutURL: "",
    record: true,
    duration: 200,
    moderatorOnlyMessage: "",
    autoStartRecording: false,
    allowStartStopRecording: true,
    webcamsOnlyForModerator: false,
    bannerText: `${room?.name}`,
    bannerColor: "#ffffff",
    muteOnStart: false,
    allowModsToUnmuteUsers: true,
    lockSettingsDisableCam: false,
    lockSettingsDisableMic: false,
    lockSettingsDisablePrivateChat: false,
    lockSettingsDisablePublicChat: false,
    lockSettingsDisableNotes: false,
    lockSettingsHideUserList: false,
    lockSettingsLockOnJoin: true,
    lockSettingsLockOnJoinConfigurable: false,
    lockSettingsHideViewersCursor: false,
    meetingKeepEvents: false,
    endWhenNoModerator: false,
    endWhenNoModeratorDelayInMinutes: 45,
    learningDashboardCleanupDelayInMinutes: 60,
    allowModsToEjectCameras: true,
    allowRequestsWithoutSession: false,
    virtualBackgroundsDisabled: false,
    userCameraCap: 3,
    meetingCameraCap: 100,
    meetingExpireIfNoUserJoinedInMinutes: 15,
    meetingExpireWhenLastUserLeftInMinutes: 15,
    logo: "",
    preUploadedPresentationOverrideDefault: true,
    notifyRecordingIsOn: false,
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      ...getDefaultSettings(room),
      ...JSON.parse(room?.meetingSettings || "{}"),
    },
  });

  const onUpdateMeetingSetings = async (data) => {
    try {
      const roomName = data.roomName || room.name;
      delete data.roomName;

      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "number") {
          if (data[key] < 0) data[key] = getDefaultSettings(room)[key];
        } else if (key === "attendeePW") {
          if (!data[key]) data[key] = getDefaultSettings(room)[key];
        } else {
          if (!data[key]) delete data[key];
        }
      });

      const res = await updateRoom({ id: room._id, name: roomName, meetingSettings: JSON.stringify(data) });

      if (isValid(res)) {
        await getUser();
        await customToast("SUCCESS", "The settings will be applied after the new meeting is created", 2500);
        reset();
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || err);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const res = await deleteRoomById(room?._id);
      if (isValid(res)) {
        toast.success(`Delete room ${room.name} successfully!`);
        setOpenConfirmDelete(false);
        await callBBBClient({ apiCall: "end", password: user._id });
        router.push("/rooms");
      }
    } catch (e) {
      toast.error(e.response?.data?.message);
      setOpenConfirmDelete(false);
    }
  };

  return (
    <Container maxWidth="xl" className={styles.recordWrapper}>
      <Card component={"form"} onSubmit={handleSubmit(onUpdateMeetingSetings)} className={styles.form} sx={{ p: 2 }}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid container item xs={12} md={6} lg={4} rowSpacing={3} alignContent={"flex-start"}>
              <Grid item xs={12}>
                <Tooltip title="The name of the room" placement="bottom-start">
                  <TextField
                    {...register("roomName")}
                    placeholder="Enter room name"
                    label="Room name"
                    size="small"
                    error={!!errors.roomName}
                    helperText={errors.roomName?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <Tooltip title="The name of the meeting" placement="bottom-start">
                  <TextField
                    {...register("name")}
                    label="Meeting name"
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Tooltip>
              </Grid>

              {/* <Grid item xs={12}>
                <Tooltip title="User must use this password to join the meeting" placement="bottom-start">
                  <TextField
                    {...register("attendeePW")}
                    type="password"
                    label="Attendee password"
                    size="small"
                    error={!!errors.attendeePW}
                    helperText={errors.attendeePW?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Tooltip>
              </Grid> */}

              {BBB_STRING_SETTINGS.map((setting) => (
                <Grid item xs={12} key={setting.key}>
                  <Tooltip title={setting.description} placement="bottom-start">
                    <TextField
                      {...register(setting.key)}
                      id={setting.key}
                      label={setting.label}
                      size="small"
                      error={!!errors?.[setting.key]}
                      helperText={errors?.[setting.key]?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            <Grid container item xs={12} md={6} lg={4} rowSpacing={3} alignContent={"flex-start"}>
              {BBB_NUMERIC_SETTINGS.map((setting) => (
                <Grid item xs={12} key={setting.key}>
                  <Tooltip title={setting.description} placement="bottom-start">
                    <TextField
                      {...register(setting.key)}
                      id={setting.key}
                      label={setting.label}
                      type="number"
                      inputProps={{
                        min: 0,
                      }}
                      size="small"
                      error={!!errors?.[setting.key]}
                      helperText={errors?.[setting.key]?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>

            <Grid container item xs={12} md={6} lg={4} rowSpacing={3} alignContent={"flex-start"}>
              {BBB_BOOLEAN_SETTINGS.map((setting) => (
                <Grid item xs={12} key={setting.key}>
                  <Tooltip title={setting.description} placement="bottom-start">
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label={setting.label}
                      name={setting.key}
                      id={setting.key}
                      checked={watch(setting.key)}
                      onChange={(e) => setValue(setting.key, e.target.checked)}
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ marginTop: 2 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 20, width: "100%" }}>
            <Button variant="outlined" color="error" onClick={() => setOpenConfirmDelete(true)} startIcon={<DeleteForever />}>
              Delete Room
            </Button>
            <LoadingButton variant="contained" type="submit" startIcon={<SaveIcon />}>
              SAVE
            </LoadingButton>
          </div>
        </CardActions>
      </Card>

      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)} fullWidth>
        <DialogTitle id="alert-dialog-title">Are you sure to delete this room?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action can not be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenConfirmDelete(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" type="submit" onClick={handleDeleteGroup}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}