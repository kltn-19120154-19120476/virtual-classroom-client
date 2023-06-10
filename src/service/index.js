import { callBBBClient } from "src/client/bbb-client";
import { updateRoom } from "src/client/room";
import { isValid } from "src/utils";

export const handleCreateMeeting = async (meetingID, name, moderatorPW, presentation) => {
  const res = await callBBBClient(
    {
      name,
      apiCall: "create",
      meetingID,
      moderatorPW,
      record: true,
      logoutURL: "localhost",
    },
    { files: JSON.stringify(presentation || []) },
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

export const handleJoinMeeting = async ({ data, room, user }) => {
  const meetingInfo = await handleCreateMeeting(room?._id, room?.name, user?._id, room.presentation);

  if (meetingInfo) {
    await updateRoom({ id: room?._id, meetingInfo: JSON.stringify(meetingInfo) });
    const res = await callBBBClient({
      meetingID: room?._id,
      ...data,
      apiCall: "join",
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
