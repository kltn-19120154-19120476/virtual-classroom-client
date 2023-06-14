import { request } from "./index";

export const createRoom = async (data) => request("POST", "/room/create", data);

export const updateRoom = async (data) => request("PUT", "/room/update", data);

export const addUserToRoom = async (data) => request("POST", "/room/add-user", data);

export const updateRoleInRoom = async (data) => request("POST", "/room/role", data);

export const removeUserFromRoom = async (data) => request("POST", "/room/remove-user", data);

export const getRoomDetail = async (roomId) => request("GET", `/room/detail/${roomId}`);

export const getRoomByIds = async (ids) => request("POST", "/room/list", { ids });

export const deleteRoomById = async (id) => request("DELETE", `/room/list/${id}`);
