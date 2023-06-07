import { request } from "./index";

export const createGroup = async (data) => request("POST", "/group/create", data);

export const inviteToGroup = async (data) => request("POST", "/group/invite", data);

export const createInviteLinkGroup = async (data) => request("POST", "/group/link", data);

export const updateRoleInGroup = async (data) => request("POST", "/group/role", data);

export const removeFromGroup = async (data) => request("POST", "/group/remove", data);

export const getGroupDetail = async (groupId) => request("GET", `/group/detail/${groupId}`);

export const getGroupByIds = async (ids) => request("POST", "/group/list", { ids });

export const sendInviteEmail = async (data) => request("POST", "/group/send-invite-email", data);

export const deleteGroupById = async (id) => request("DELETE", `/group/list/${id}`);
