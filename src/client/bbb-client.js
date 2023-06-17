import axios from "axios";
import sha1 from "js-sha1";
import { getMeetingInfo, isMeetingRunning } from "src/service";
import { BBB_SECRET, BBB_SERVER } from "src/sysconfig";
import convert from "xml-js";

const RETURN_CODE = {
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
};

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const axiosInstance = axios.create({
  baseURL: BBB_SERVER,
  timeout: 500000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  maxContentLength: "Infinity",
  maxBodyLength: "Infinity",
});

const createChecksum = (apiCall, params, secret = BBB_SECRET) => {
  const queryString = new URLSearchParams(params).toString();
  return sha1(`${apiCall}${queryString}${secret}`);
};

export const createPassword = (pw) => sha1(`${pw}${BBB_SECRET}`);

function removeTextProperty(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (obj[key]._text !== undefined) {
        if (Number.isInteger(+obj[key]._text)) obj[key] = +obj[key]._text;
        else if (["true", "false"].includes(obj[key]._text)) obj[key] = obj[key]._text === "true";
        else obj[key] = obj[key]._text;
      }
      removeTextProperty(obj[key]);
    }
  }

  return obj;
}

const resToObject = (res) => {
  if (isObject(res.data)) {
    return res.data.response;
  }

  const rawObject = convert.xml2js(res.data, { compact: true, spaces: 4 });

  const finalObject = removeTextProperty(rawObject.response);

  return finalObject;
};

const makeBBBRequest = async (apiCall, params, body = "") => {
  if (apiCall === "join") {
    const { meetingID, password = "", role = "", fullName } = params;

    if (!role || !["MODERATOR", "VIEWER", "GUEST"].includes(role)) {
      return {
        returncode: RETURN_CODE.FAILED,
        message: "role must be attendee or moderator or guest",
      };
    }

    const isMeetingRunningRes = await isMeetingRunning(meetingID);

    if (isMeetingRunningRes?.running === "false" && role !== "MODERATOR") {
      return {
        returncode: RETURN_CODE.FAILED,
        message: "Meeting is not started",
      };
    }

    if (role === "MODERATOR" || role === "VIEWER") {
      const joinMeetingParams = {
        meetingID,
        redirect: true,
        fullName,
        role,
      };

      const checksum = createChecksum("join", joinMeetingParams);

      return {
        returncode: RETURN_CODE.SUCCESS,
        joinUrl: BBB_SERVER + "join?" + new URLSearchParams({ ...joinMeetingParams, checksum }).toString(),
      };
    }

    if (role === "GUEST") {
      const joinMeetingParams = {
        meetingID,
        redirect: true,
        fullName,
        password: createPassword(password),
      };

      const meetingInfo = await getMeetingInfo(meetingID);

      if (meetingInfo?.attendeePW !== joinMeetingParams?.password) {
        return {
          returncode: RETURN_CODE.FAILED,
          message: "Invalid password",
        };
      }

      const checksum = createChecksum("join", joinMeetingParams);

      return {
        returncode: RETURN_CODE.SUCCESS,
        joinUrl: BBB_SERVER + "join?" + new URLSearchParams({ ...joinMeetingParams, checksum }).toString(),
      };
    }
  }

  if (params.attendeePW) params.attendeePW = createPassword(params.attendeePW);
  if (params.moderatorPW) params.moderatorPW = createPassword(params.moderatorPW);
  if (params.password) params.password = createPassword(params.password);

  const checksum = createChecksum(apiCall, params);

  const res = await axiosInstance.post(apiCall, body, {
    params: {
      ...params,
      checksum,
    },
    headers: {
      "Content-Type": "application/xml",
    },
  });

  return resToObject(res);
};

export const callBBBClient = async (params = {}, body = "") => {
  try {
    const bbbParams = params;

    const { files = null } = body;
    const { apiCall = null } = bbbParams;

    if (!apiCall) throw new Error("apiCall is required!");

    let bbbBody = body;

    if (files) {
      const filesXML = JSON.parse(files)
        ?.map((f) => `<module name="presentation"><document url="${f.url}" filename="${f.name}" downloadable="true" /></module>`)
        ?.join("");
      bbbBody = `<?xml version="1.0" encoding="UTF-8"?><modules>${filesXML}</modules>`;
    }

    const result = await makeBBBRequest(apiCall, bbbParams, bbbBody);

    return result;
  } catch (err) {
    return {
      returncode: "FAILED",
      message: err.message,
    };
  }
};
