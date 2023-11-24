import FetchRequest from "@/api/FetchRequest";

interface loginBody {
  username: string;
  password: string;
  code: string;
  uuid: string;
}
// 登录方法
export const login = (
  username: string,
  password: string,
  code: string,
  uuid: string
) => {
  const data: loginBody = {
    username,
    password,
    code,
    uuid,
  };
  return FetchRequest.post("/login", JSON.stringify(data), false);
};

// 注册方法
export const register = (data: any) =>
  FetchRequest.post("/register", JSON.stringify(data), false);

// 退出方法
export const logout = () => FetchRequest.post("/logout", "", true);

// 获取验证码
export const getCodeImg = () => FetchRequest.get("/captchaImage", false);
