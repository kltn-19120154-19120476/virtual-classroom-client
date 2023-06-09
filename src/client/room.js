import { request } from "./index";

export const createRoom = async (data) => request("POST", "/room/create", data);

export const updateRoom = async (data) => request("PUT", "/room/update", data);

export const inviteToRoom = async (data) => request("POST", "/room/invite", data);

export const createInviteLinkRoom = async (data) => request("POST", "/room/link", data);

export const updateRoleInRoom = async (data) => request("POST", "/room/role", data);

export const removeFromRoom = async (data) => request("POST", "/room/remove", data);

export const getRoomDetail = async (groupId) => request("GET", `/room/detail/${groupId}`);

export const getRoomByIds = async (ids) => request("POST", "/room/list", { ids });

export const sendInviteEmail = async (data) => request("POST", "/room/send-invite-email", data);

export const deleteRoomById = async (id) => request("DELETE", `/room/list/${id}`);
