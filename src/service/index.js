import { toast } from "react-toastify";
import { callBBBClient } from "src/client/bbb-client";
import { createRecording, getRecordingsByRoomId, updateRoom } from "src/client/room";
import { BBB_DEFAULT_ATTENDEE_PASSWORD, WEB_CLIENT_HOST } from "src/sysconfig";
import { getData, isValid } from "src/utils";

export const getDefaultMeetingSettings = (room) => ({
  name: room?.name,
  roomName: room?.name,
  welcome: `Welcome to ${room?.name}`,
  maxParticipants: 100,
  logoutURL: `${WEB_CLIENT_HOST}`,
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
  endWhenNoModerator: true,
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
  publishMeeting: true,
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
    const meetingInfo = await getMeetingInfo(room?._id);

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
      const res = await callBBBClient({
        meetingID: room?._id,
        role: "MODERATOR",
        apiCall: "join",
        fullName: user?.name,
      });
      if (isValid(res)) {
        window.open(res.joinUrl);
        window.focus();
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    }
  }

  if (isMember) {
    const isRunning = (await isMeetingRunning(room?._id))?.running ?? false;

    if (isRunning) {
      const res = await callBBBClient({
        meetingID: room?._id,
        role: "VIEWER",
        apiCall: "join",
        fullName: user?.name,
      });
      if (res?.joinUrl) {
        window.open(res.joinUrl);
        window.focus();
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Meeting is not started");
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

  const bbbRecordings = recordings.map((recording) => {
    const { startTime, endTime, published, participants, size, isBreakout, playback } = recording;
    return {
      ...recording,
      startTime,
      endTime,
      published: published,
      participants,
      size,
      isBreakout: isBreakout,
      url: playback.format.url,
    };
  });

  try {
    await Promise.all(
      bbbRecordings.map(({ recordID, meetingID, startTime, endTime, url, name, participants }) =>
        createRecording({
          recordId: recordID,
          meetingId: meetingID,
          startTime,
          endTime,
          playbackUrl: url,
          name,
          participants,
          published: true,
        }),
      ),
    );
  } catch (e) {}

  try {
    const lmsRecordings = await getRecordingsByRoomId(meetingID);
    return getData(lmsRecordings);
  } catch (e) {
    return [];
  }
};

export const endMeeting = (password, meetingID) => callBBBClient({ apiCall: "end", password, meetingID });

export const isMeetingRunning = (meetingID) => callBBBClient({ apiCall: "isMeetingRunning", meetingID });

export const getMeetingInfo = (meetingID) => callBBBClient({ apiCall: "getMeetingInfo", meetingID });

export const updateLearningDashboards = async (room, data) => {
  const newData = JSON.parse(data);
  const learningDashboards = room.learningDashboards;

  const dataIndex = learningDashboards.findIndex((dashboard) => {
    const { extId = "", intId = "" } = JSON.parse(dashboard);
    return `${extId}-${intId}` === `${newData.extId}-${newData.intId}`;
  });

  if (dataIndex === -1) {
    learningDashboards.unshift(JSON.stringify(newData));
  } else {
    learningDashboards[dataIndex] = JSON.stringify(newData);
  }

  await updateRoom({ id: room._id, learningDashboards });
  return learningDashboards;
};

export const getLearningDashboardFromInternalMeetingId = (internalMeetingID) =>
  callBBBClient({
    meeting: internalMeetingID || "",
    apiCall: "learningDashboardFromMeetingId",
  });
