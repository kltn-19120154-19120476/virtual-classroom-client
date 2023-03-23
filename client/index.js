import axios from "../config/axios";

export const request = async (method, url, data = {}) => {
  let res = null;
  switch (method) {
    case "GET": {
      res = await axios.get(url, {
        params: data,
      });
      break;
    }

    case "POST": {
      res = await axios.post(url, data);
      break;
    }

    case "PUT": {
      res = await axios.put(url, data);
      break;
    }

    case "DELETE": {
      res = await axios.delete(url, {
        params: data,
      });
      break;
    }
  }
  return res?.data || null;
};
