import axios from "axios";
import TokenService from "./TokenService";
import { BACKEND_BASE_URL } from '~/constants/networking';
const REFRESH_URL = "/user/refresh_token";

const instance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAuthToken();
    if (config.url !== REFRESH_URL && config.headers != token) {
      config.headers["Authorization"] = "Bearer " + token;
    } else {
      delete config.headers["Authorization"];
    }

    config.baseURL = BACKEND_BASE_URL;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    // Access Token was expired
    if (
      originalConfig.url !== REFRESH_URL &&
      err.response &&
      err.response.status === 401 &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;
      try {
        const rs = await instance.post(`/user/refresh_token`, {
          accessToken: TokenService.getAuthToken(),
          refreshToken: TokenService.getRefreshToken(),
        });
        TokenService.setSession(rs.data);

        return instance(originalConfig);
      } catch (_error) {
        window.location.href = "/login";
        // return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
