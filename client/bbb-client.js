import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://bbb25.test/bigbluebutton/api",
  timeout: 5000,
  headers: {
    "Accept-Version": 1,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
  },
  withCredentials: true,
});

export const createBBBClass = async ({
  meetingID,
  recordID,
  name,
  attendeePW,
  moderatorPW,
  fullName,
  welcome = `<h1>Personal meeting</h1>`,
  voiceBridge = 74236,
  record = true,
  autoStartRecording = false,
  allowStartStopRecording = true,
  redirect = true,
  publish = false,
}) => {
  const res = await makeRequest("/create", {
    params: {
      meetingID,
      recordID,
      name,
      attendeePW,
      moderatorPW,
      fullName,
      welcome,
      voiceBridge,
      record,
      autoStartRecording,
      allowStartStopRecording,
      redirect,
      publish,
    },
  });
  console.log(res);
  return res;
};

export const joinBBBClass = async ({ meetingID, fullName, password, redirect = true }) => {
  const res = await makeRequest("/create", {
    params: {
      meetingID,
      fullName,
      password,
      redirect,
    },
  });
  return res;
};

export const isMeetingRunning = async ({ meetingID, password }) => {
  const res = await makeRequest("/isMeetingRunning", {
    params: {
      meetingID,
    },
  });
  return res;
};

export const getMeetingInfo = async ({ meetingID, password }) => {
  const res = await makeRequest("/getMeetingInfo", {
    params: {
      meetingID,
      password,
    },
  });
  return res;
};

export const endMeeting = async ({ meetingID, password }) => {
  const res = await makeRequest("/end", {
    params: {
      meetingID,
      password,
    },
  });
  return res;
};
