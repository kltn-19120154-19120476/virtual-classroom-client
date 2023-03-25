import axios from "axios";
import sha1 from "js-sha1";
import convert from "xml-js";
import { BBB_SECRET, BBB_SERVER } from "../sysconfig";

const axiosInstance = axios.create({
    baseURL: BBB_SERVER,
    timeout: 5000,
    headers: {
        "Accept-Version": 1,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
    },
    withCredentials: true,
});

const createChecksum = (apiCall, params, secret = BBB_SECRET) => {
    const queryString = new URLSearchParams(params).toString();
    return sha1(`${apiCall}${queryString}${secret}`);
};

const makeBBBRequest = async (apiCall, params) => {
    const checksum = createChecksum(apiCall, params);

    if (apiCall === "join") {
        window.open(
            BBB_SERVER +
                "/join?" +
                new URLSearchParams({
                    ...params,
                    checksum,
                }).toString(),
            "_blank",
        );
        return;
    }

    const res = await axiosInstance(apiCall, {
        params: {
            ...params,
            checksum,
        },
    });

    const rawObject = convert.xml2js(res.data, { compact: true, spaces: 4 });

    const finalObject = {};

    Object.keys(rawObject.response).forEach(
        (key) => (finalObject[key] = rawObject.response[key]._text),
    );

    console.log(finalObject);

    return finalObject;
};

export const createBBBClass = async ({
    meetingID,
    recordID,
    name,
    attendeePW,
    moderatorPW,
    fullName = "",
    welcome = ``,
    voiceBridge = 74236,
    record = true,
    autoStartRecording = false,
    allowStartStopRecording = true,
    publish = false,
}) => {
    const params = {
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
        publish,
    };

    const res = await makeBBBRequest("create", params);
    return res;
};

export const joinBBBClass = async ({
    meetingID,
    password,
    fullName = "",
    redirect = true,
}) => {
    const params = {
        meetingID,
        password,
        fullName,
        redirect,
    };

    const res = await makeBBBRequest("join", params);
    return res;
};

export const isMeetingRunning = async ({ meetingID }) => {
    const params = { meetingID };
    const res = await makeBBBRequest("isMeetingRunning", params);
    return res;
};

export const getMeetingInfo = async ({ meetingID, password }) => {
    const params = {
        meetingID,
        password,
    };
    const res = await makeBBBRequest("getMeetingInfo", params);
    return res;
};

export const endMeeting = async ({ meetingID, password }) => {
    const params = {
        meetingID,
        password,
    };
    const res = await makeBBBRequest("end", params);
    return res;
};
