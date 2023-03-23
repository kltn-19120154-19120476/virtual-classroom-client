import { toast } from "react-toastify";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const customToast = async (type, content, timeout = 2000) => {
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
