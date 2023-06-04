import axios from "axios";
import { BBB_SECRET, BBB_SERVER } from "src/sysconfig";
import sha1 from "js-sha1";
import convert from "xml-js";

const INTERNAL_SERVER_STATUS_CODE = 500,
  RETURN_CODE = 200,
  SUCCESS_STATUS_CODE = 200;

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

const createPassword = (pw) => sha1(`${pw}${BBB_SECRET}`);

function removeTextProperty(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (obj[key]._text !== undefined) {
        obj[key] = obj[key]._text;
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
    if (!params.role || !["moderator", "attendee"].includes(params.role)) {
      return {
        returncode: RETURN_CODE.FAILED,
        message: "role must be attendee or moderator",
      };
    }

    const { meetingID, password, role, fullName } = params;

    const infoMeetingRes = await makeBBBRequest("getMeetingInfo", {
      meetingID,
      password,
    });

    if (infoMeetingRes.returncode === RETURN_CODE.FAILED) {
      return infoMeetingRes;
    }

    const joinMeetingParams = {
      meetingID,
      password: createPassword(password),
      redirect: true,
      fullName,
    };

    const checksum = createChecksum(apiCall, joinMeetingParams);

    if (joinMeetingParams.password === (role === "attendee" ? infoMeetingRes.attendeePW : infoMeetingRes.moderatorPW))
      return {
        returncode: RETURN_CODE.SUCCESS,
        joinUrl: BBB_SERVER + "join?" + new URLSearchParams({ ...joinMeetingParams, checksum }).toString(),
      };

    return {
      returncode: RETURN_CODE.FAILED,
      message: "wrong password",
    };
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

export const callBBBClient = async (params = {}, body = '') => {
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
