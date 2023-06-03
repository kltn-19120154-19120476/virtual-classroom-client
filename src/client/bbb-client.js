import axios from "axios";
import { PROXY_HOST } from "src/sysconfig";

const axiosInstance = axios.create({
  baseURL: PROXY_HOST,
  timeout: 500000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  },
  maxContentLength: "Infinity",
  maxBodyLength: "Infinity",
});

export async function callBBBProxy(params, body) {
  const res = await axiosInstance.post("/bigbluebutton/api", body, {
    params: params,
  });

  return res?.data || {};
}
