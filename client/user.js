import { request } from "./index";

export const getUserInfo = async () => request("GET", "/user/current-user");
export const updateUserInfo = async (data) => request("PUT", "/user/update-user", data);
export const getUserByIds = async (ids) => request("POST", "/user/list", { ids });
export const sendVerificationEmail = async () => request("POST", "/user/send-verification-email", { isSendVerificationEmail: true });
