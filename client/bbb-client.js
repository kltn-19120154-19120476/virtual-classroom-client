import axios from "axios";
import sha1 from "js-sha1";
import convert from "xml-js";
import { BBB_SECRET, BBB_SERVER } from "../sysconfig";

const axiosInstance = axios.create({
    baseURL: BBB_SERVER,
    timeout: 500000,
    headers: {
        "Accept-Version": 1,
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
    },
    withCredentials: true,
    maxContentLength: "Infinity",
    maxBodyLength: "Infinity",
});

const createChecksum = (apiCall, params, secret = BBB_SECRET) => {
    const queryString = new URLSearchParams(params).toString();

    console.log({ params, queryString });

    return sha1(`${apiCall}${queryString}${secret}`);
};

const makeBBBRequest = async (apiCall, params, body = "") => {
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

    const res = await axiosInstance.post(apiCall, body, {
        params: {
            ...params,
            checksum,
        },
        headers: {
            "Content-Type": "application/xml",
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

export const createBBBClass = async (
    {
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
    },
    fileUpload,
) => {
    let params = {
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

    let body = "";

    if (fileUpload) {
        const filesXML = fileUpload
            .map(
                (f) =>
                    `<module name="presentation"><document url="${f.uploadUrl}" filename="${f.name}" downloadable="true" /></module>`,
            )
            .join("");

        // body = `<?xml version="1.0" encoding="UTF-8"?><modules><module name="presentation"><document url="https://www.africau.edu/images/default/sample.pdf" /></module><module name="presentation"><document url="https://www.africau.edu/images/default/sample.pdf" /></module></modules>`;
        body = `<?xml version="1.0" encoding="UTF-8"?><modules>${filesXML}</modules>`;
    }

    const res = await makeBBBRequest("create", params, body);
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

export const getRecordings = async ({ meetingID, recordID }) => {
    const params = {
        meetingID,
        recordID,
    };
    const res = await makeBBBRequest("getRecordings", params);
    return res;
};

export const publishRecordings = async ({ recordID }) => {
    const params = {
        recordID,
        publish: false,
    };
    const res = await makeBBBRequest("publishRecordings", params);
    return res;
};

export const insertDocument = async ({ meetingID, file }) => {
    const params = {
        meetingID,
        checksum: createChecksum("insertDocument", { meetingID }),
    };

    const filesXML = file
        .map(
            (f) =>
                `<module name="presentation"><document url="${f.uploadUrl}" filename="${f.name}" downloadable="true" /></module>`,
        )
        .join("");

    const res = await axios.post(
        BBB_SERVER + "/insertDocument?" + new URLSearchParams(params),
        `<?xml version="1.0" encoding="UTF-8"?><modules>${filesXML}</modules>`,
        {
            headers: {
                "Content-Type": "application/xml",
            },
        },
    );
    console.log(res);
};
