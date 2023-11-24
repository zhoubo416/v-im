import { useUserStore } from "@/store/userStore";
import Auth from "@/api/Auth";

const store = useUserStore();
/**
 * 实现自定义存储，确保用户缓存的数据只能自己读取
 */
const storage: Storage = {
  key(index: number): string | null {
    return index.toString();
  },
  length: 0,
  removeItem(key: string): void {
    console.log(key);
  },
  clear(): void {
    console.log("");
  },
  setItem(key: string, value: string): void {
    key = `${Auth.getIp}-${store.user?.id}-${key}`
    return localStorage.setItem(key, value);
  },
  getItem(key: string): string | null {
    key = `${Auth.getIp}-${store.user?.id}-${key}`
    return localStorage.getItem(key);
  },
};
export default storage;
