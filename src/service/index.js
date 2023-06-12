import { callBBBClient } from "src/client/bbb-client";
import { updateRoom } from "src/client/room";
import { BBB_DEFAULT_ATTENDEE_PASSWORD, WEB_HOST } from "src/sysconfig";
import { isValid } from "src/utils";

export const handleCreateMeeting = async (meetingID, name, moderatorPW, presentation) => {
  const res = await callBBBClient(
    {
      name,
      apiCall: "create",
      meetingID,
      moderatorPW,
      attendeePW: BBB_DEFAULT_ATTENDEE_PASSWORD,
      record: true,
      logoutURL: WEB_HOST.replace("https://", ""),
    },
    { files: typeof presentation !== "string" ? JSON.stringify(presentation || []) : presentation },
  );

  if (res?.returncode === "SUCCESS" || res?.messageKey === "idNotUnique") {
    const meetingInfo = await callBBBClient({
      meetingID: meetingID,
      password: moderatorPW,
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
  const isOwner = room?.ownerId === user?._id;
  const meetingInfo = await handleCreateMeeting(room?._id, room?.name, user?._id, room.presentation);

  if (meetingInfo) {
    await updateRoom({ id: room?._id, meetingInfo: JSON.stringify(meetingInfo) });
    const res = await callBBBClient({
      meetingID: room?._id,
      password: isOwner ? user?._id : BBB_DEFAULT_ATTENDEE_PASSWORD,
      role: isOwner ? "moderator" : "attendee",
      apiCall: "join",
      fullName: user?.name,
    });
    if (res?.joinUrl) {
      window.open(res.joinUrl);
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
