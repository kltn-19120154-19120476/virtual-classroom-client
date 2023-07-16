import { toast } from "react-toastify";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "src/firebase";
import { WEB_HOST } from "src/sysconfig";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const customToast = async (type, content, timeout = 1000) => {
  switch (type) {
    case "SUCCESS":
      toast.success(content);
      break;
    case "ERROR":
      toast.error(content);
      break;
    case "INFO":
      toast.info(content);
      break;
    default:
      toast.info(content);
      break;
  }
  await sleep(timeout);
};

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const uploadImageToFirebase = async (file) => {
  const imageRef = ref(storage, `/bigbluebutton/${file.name}`);
  const fileToUpload = dataURLtoFile(file.path, file.name);
  await uploadBytes(imageRef, fileToUpload);
  const url = await getDownloadURL(imageRef);
  const removedTokenUrl = url.substring(0, url.lastIndexOf("&token"));
  return removedTokenUrl;
};

export const stringToSlug = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const shuffle = (array) => {
  let i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export const getLinkWithPrefix = (src) => WEB_HOST + src;

export const isValid = (res) => res?.status === "OK" || res?.returncode === "SUCCESS";

export const getFirst = (res) => res?.data?.[0] || null;

export const getData = (res) => res?.data || [];

export const formatTime = (time, type = "vi-VN") => {
  if (!time) return "N/A";
  const result = new Date(+time).toLocaleString(type);
  return result !== "Invalid Date" ? result : "N/A";
};

export const splitFilenameAndExtension = (filename) => {
  if (!filename) return { name: "", extension: "" };
  // Find the last occurrence of a period (.) in the filename
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex !== -1) {
    // Split the filename and extension using the last dot index
    const name = filename.substring(0, lastDotIndex);
    const extension = filename.substring(lastDotIndex + 1);
    return { name, extension };
  }

  // If there is no extension, return the whole filename as the name and an empty string for the extension
  return { name: filename, extension: "" };
};
