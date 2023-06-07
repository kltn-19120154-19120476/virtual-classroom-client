import { request } from "./index";

export const registerFunc = async (data) => await request("POST", "auth/register", data);

export const loginFunc = async (data) => await request("POST", "auth/login", data);

export const loginGoogleFunc = async (data) => await request("POST", "auth/login/google", data);

export const activeAccount = async (data) => await request("POST", "auth/verify", data);

export const resetAccount = async (data) => await request("POST", "auth/reset", data);
