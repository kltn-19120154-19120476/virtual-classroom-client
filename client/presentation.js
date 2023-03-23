import { request } from "./index";

export const createPresentation = async (data) => request("POST", "/presentation/create", data);

export const updatePresentation = async (data) => request("PUT", "/presentation/update", data);

export const deletePresentation = async (id) => request("DELETE", "/presentation/delete", { id });

export const getPresentationDetail = async (id) => request("GET", `/presentation/detail/${id}`);

export const getPresentationByIds = async (ids) => request("POST", "/presentation/list", { ids });

export const addCollaborator = async (data) => request("POST", "/presentation/collaboration/add", data);

export const removeFromPresentation = async (data) => request("PUT", "/presentation/collaboration/remove", data);

export const getQuestionList = async (id) => request("GET", `/presentation/questions/${id}`);

export const assignPresentationToGroup = async (data) => request("POST", "/presentation/assign-group", data);

export const removeGroupFromPresentation = async (data) => request("POST", "/presentation/remove-assign-group", data);

export const getGroupPresentation = async () => request("GET", `/presentation/assign-group/`);

export const saveChat = async (data) => request("POST", "/presentation/chat/save", data);

export const clearChat = async (presentationId) => request("DELETE", `/presentation/chat/clear/${presentationId}`);

export const getChatPaging = async (page, presentId, options = {}) => request("GET", `/presentation/chat/${page}/${presentId}`, options);

export const updateHistory = async (data, presentationId) => request("PUT", `/presentation/history`, { data, presentationId });
