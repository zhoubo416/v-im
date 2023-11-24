import { createApp } from "vue";
import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";
import UserModal from "@/components/user-modal/UserModal.vue";
import router from "@/router";
import store from "@/store";

/**
 * 函数方式调用日志
 * @param userId userId
 * @param showSend showSend
 */
const showUser = (userId: string, showSend: boolean): void => {
  const instance = createApp(UserModal, { userId, showSend, closeDialog });
  instance.use(router);
  instance.use(store);

  // 使用element-plus 并且设置全局的大小
  instance.use(ElementPlus, {
    locale: locale,
  });
  const node = document.createElement("div");
  document.body.appendChild(node);
  instance.mount(node);
  function closeDialog() {
    instance.unmount();
    document.body.removeChild(node);
  }
};

export default showUser;
