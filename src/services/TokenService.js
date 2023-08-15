import CookiesService from "./CookiesService";

class TokenService {
  getRefreshToken() {
    return this.getUser()?.refreshToken;
  }

  getAuthToken() {
    return this.getUser()?.accessToken;
  }

  getUser() {
    const user = CookiesService.getObject("user");
    return user;
  }

  isAuthenticated() {
    const authToken = this.getAuthToken();
    return authToken && authToken.length > 0;
  }

  setSession(user) {
    CookiesService.setObject(user, "user");
  }

  removeSession() {
    CookiesService.removeByKey("user");
  }
}

export default new TokenService();
