import { createApp } from "vue";
import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";
import GroupModal from "@/components/group-modal/GroupModal.vue";
import router from "@/router";

/**
 * 函数方式调用日志
 * @param groupId groupId
 * @param showSend showSend
 */
const showGroup = (groupId: string, showSend: boolean): void => {
  const instance = createApp(GroupModal, { groupId, showSend, closeDialog });
  instance.use(router);
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

export default showGroup;
