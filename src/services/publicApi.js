import axios from "axios";
import { BACKEND_BASE_URL } from '~/constants/networking';

const instance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

instance.interceptors.request.use(
  (config) => {
    config.baseURL = BACKEND_BASE_URL;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
