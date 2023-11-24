import { getCurrentInstance } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { proxy } = getCurrentInstance();
const openImageProxy = (event: any) => {
  event.preventDefault();
  if (event.target.nodeName === "IMG") {
    proxy.$winControl.default.openURL(event.target.src);
  } else if (
    event.target.className === "message-file" ||
    event.target.nodeName.toUpperCase() === "A"
  ) {
    proxy.$winControl.default.openURL(event.target.href);
  }
};
export default openImageProxy;
