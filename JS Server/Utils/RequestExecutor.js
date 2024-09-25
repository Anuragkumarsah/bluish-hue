import axios from "axios";

const getRequest = async (url, header = null) => {
  const req = await axios.get(url, header ?? {});
  return req.data;
};

export default { getRequest };
