import TokenService from "./TokenService";
import publicApi from "./publicApi";

class AuthService {
  async login(email, password) {
    TokenService.removeSession();
    return publicApi
      .post("/user/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data) {
          TokenService.setSession(response.data);
        }
        return response.data;
      });
  }
}

export default new AuthService();
