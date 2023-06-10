import { callBBBClient } from "src/client/bbb-client";
import { updateRoom } from "src/client/room";

export const handleCreateMeeting = async (meetingID, name, moderatorPW) => {
  const res = await callBBBClient({
    name,
    apiCall: "create",
    meetingID,
    moderatorPW,
    record: true,
  });

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
  const meetingInfo = await handleCreateMeeting(room?._id, room?.name, user?._id);

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
