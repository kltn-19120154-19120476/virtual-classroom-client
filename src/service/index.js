import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { updateRoom } from "src/client/room";
import { BBB_DEFAULT_ATTENDEE_PASSWORD, WEB_CLIENT_HOST } from "src/sysconfig";
import { isValid } from "src/utils";

export const getDefaultMeetingSettings = (room) => ({
  name: room?.name,
  roomName: room?.name,
  welcome: `Welcome to ${room?.name}`,
  maxParticipants: 100,
  logoutURL: WEB_CLIENT_HOST,
  record: true,
  duration: 200,
  moderatorOnlyMessage: "",
  autoStartRecording: false,
  allowStartStopRecording: true,
  webcamsOnlyForModerator: false,
  bannerText: `${room?.name}`,
  bannerColor: "#000",
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
  preUploadedPresentationOverrideDefault: true,
  notifyRecordingIsOn: false,
});

export const handleCreateMeeting = async ({ room, user }) => {
  const meetingSettings = room?.meetingSettings ? JSON.parse(room?.meetingSettings) : getDefaultMeetingSettings(room);
  const res = await callBBBClient(
    {
      name: room?.name,
      apiCall: "create",
      meetingID: room?._id,
      moderatorPW: user?._id,
      attendeePW: BBB_DEFAULT_ATTENDEE_PASSWORD,
      record: true,
      ...meetingSettings,
    },
    { files: typeof room?.presentation !== "string" ? JSON.stringify(room?.presentation || []) : room?.presentation },
  );

  if (res?.returncode === "SUCCESS" || res?.messageKey === "idNotUnique") {
    const meetingInfo = await callBBBClient({
      meetingID: room?._id,
      apiCall: "getMeetingInfo",
    });

    delete meetingInfo.apiCall;
    delete meetingInfo.returncode;
    delete meetingInfo.checksum;
    delete meetingInfo.moderatorPW;
    delete meetingInfo.attendeePW;

    return meetingInfo;
  }

  return null;
};

export const handleJoinMeeting = async ({ room, user }) => {
  const isOwner = room?.isOwner;
  const isMember = room?.memberIds?.includes(user?._id);

  if (isOwner) {
    const meetingInfo = await handleCreateMeeting({ room, user });

    if (meetingInfo) {
      await updateRoom({ id: room?._id, meetingInfo: JSON.stringify(meetingInfo) });
      const res = await callBBBClient({
        meetingID: room?._id,
        role: "MODERATOR",
        apiCall: "join",
        fullName: user?.name,
      });
      if (isValid(res)) {
        window.open(res.joinUrl);
      } else {
        toast.error(res.message);
      }
    }
  }

  if (isMember) {
    const res = await callBBBClient({
      meetingID: room?._id,
      role: "VIEWER",
      apiCall: "join",
      fullName: user?.name,
    });
    if (res?.joinUrl) {
      window.open(res.joinUrl);
    } else {
      toast.error(res.message);
    }
  }
};

export const getRecordings = async ({ meetingID }) => {
  const res = await callBBBClient({
    meetingID,
    apiCall: "getRecordings",
  });

  let recordings;

  if (isValid(res)) {
    if (res?.recordings?.recording?.recordID) recordings = [res?.recordings?.recording];
    else if (res?.recordings?.recording?.[0]?.recordID) recordings = res?.recordings?.recording;
    else recordings = [];
  } else {
    recordings = [];
  }

  return recordings.map((recording) => {
    const { startTime, endTime, published, participants, size, isBreakout, playback } = recording;
    return {
      ...recording,
      startTime: +startTime,
      endTime: +endTime,
      published: published === "true",
      participants: +participants,
      size: +size,
      isBreakout: isBreakout === "true",
      url: playback.format.url,
    };
  });
};
