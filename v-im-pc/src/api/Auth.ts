import vimConfig from "@/config/VimConfig";
import FetchRequest from "@/api/FetchRequest";

class Auth {
  static getToken = (): string => {
    return localStorage.getItem("access_token") ?? "";
  };

  static setToken = (token: string): void => {
    localStorage.setItem("access_token", token);
  };

  static setRefreshToken = (token: string): void => {
    localStorage.setItem("refresh_token", token);
  };

  static getRefreshToken = (): string => {
    return localStorage.getItem("refresh_token") ?? "";
  };

  static clearToken = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  static setIp = (ip: string): void => {
    localStorage.setItem("ip", ip);
  };

  static getIp = (): string => {
    return localStorage.getItem("ip") ?? vimConfig.host;
  };

  static isLogin = () => {
    return new Promise((resolve, reject) => {
      const header: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + Auth.getToken(),
      };
      const config: RequestInit = {
        method: "GET",
        mode: "cors",
        headers: header,
      };
      fetch(FetchRequest.getHost() + "/api/sys/users/my", config)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.code === 200) {
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          reject(false);
        });
    });
  };
}
export default Auth;
