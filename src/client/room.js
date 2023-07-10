import { request } from "./index";

export const createRoom = async (data) => request("POST", "/room/create", data);

export const updateRoom = async (data) => request("PUT", "/room/update", data);

export const addUserToRoom = async (data) => request("POST", "/room/add-user", data);

export const updateRoleInRoom = async (data) => request("POST", "/room/role", data);

export const removeUserFromRoom = async (data) => request("POST", "/room/remove-user", data);

export const getRoomDetail = async (roomId) => request("GET", `/room/detail/${roomId}`);

export const getRoomByIds = async (ids) => request("POST", "/room/list", { ids });

export const deleteRoomById = async (id) => request("DELETE", `/room/list/${id}`);

export const getRecordingsByRoomId = async (roomId) => request("POST", "/recording/list", { meetingId: roomId });

export const createRecording = async (data) => request("POST", "/recording/create", data);

export const deleteRecording = async ({ recordId, roomId }) =>
  request("DELETE", "/recording/delete?" + new URLSearchParams({ recordId, roomId }).toString());

export const updateRecording = async ({ data, roomId, recordId }) =>
  request("PUT", "/recording/update", { data: JSON.stringify(data), roomId, recordId });

export const createDocument = async ({ presId, filename, uploadUrl }) =>
  request("POST", "/document/create", { presId, filename, uploadUrl });

export const getDocuments = async (ids = []) => request("POST", "/document/list", { ids });

export const deleteDocument = async (id) => request("DELETE", `/document/delete?id=${id}`);

export const updateDocument = async (id, data) => request("PUT", `/document/update?id=${id}`, data);
