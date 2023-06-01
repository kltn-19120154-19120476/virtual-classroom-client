import { request } from "./index";

export const createDocument = async (data) =>
  request("POST", "/document/create", data);

export const getDocumentByIds = async (ids) =>
  request("POST", "/document/list", { ids });
