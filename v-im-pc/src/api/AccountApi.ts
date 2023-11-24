import router from "@/router";
import { ElMessage } from "element-plus";

class AccountApi {
  static toLogin = (): void => {
    router.push("/").catch(() => {
      ElMessage.error("无法跳转到登录界面");
    });
  };
}
export default AccountApi;
