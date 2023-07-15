import { request } from "./index";

export const getUserInfo = async () => request("GET", "/user/current-user");
export const updateUserInfo = async (data) => request("PUT", "/user/update-user", data);
export const getUserByIds = async (ids) => request("POST", "/user/list", { ids });
export const sendVerificationEmail = async () =>
  request("POST", "/user/send-verification-email", {
    isSendVerificationEmail: true,
  });

export const adminGetUserList = async (search = "") => request("GET", `/user/admin/user/list?search=${search}`);
export const adminUpdateUser = async (userId, data) => request("PUT", `/user/admin/user/update?userId=${userId}`, data);
export const adminDeleteUser = async (userId) => request("DELETE", `/user/admin/user/delete?userId=${userId}`);
export const adminResetUserPassword = async (userId) => request("GET", `/user/admin/user/reset-password?userId=${userId}`);
