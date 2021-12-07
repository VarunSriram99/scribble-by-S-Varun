import axios from "axios";
import Cookie from "universal-cookie";

axios.defaults.baseURL = "/";

export const setAuthHeaders = (setLoading = () => null) => {
  const cookies = new Cookie();
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('[name="csrf-token"]')
      .getAttribute("content"),
  };
  const token = cookies.get("authToken");
  if (token) axios.defaults.headers["X-Auth-Token"] = token;
  setLoading(false);
};
