import axios from "axios";
import { SERVER_DOMAIN } from "../sysconfig";

const instance = axios.create({
  baseURL: SERVER_DOMAIN,
  timeout: 5000,
  headers: {
    "Accept-Version": 1,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("access_token") : ""}`,
  },
});

export default instance;
