import { defineStore } from "pinia";
import Chat from "../mode/Chat";
import Message from "../mode/Message";
import ChatType from "@/config/ChatType";
import GroupApi from "@/api/GroupApi";
import myLocalStoreUtils from "@/utils/MyLocalStoreUtils";
import router from "@/router";
import UserApi from "@/api/UserApi";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
export const useChatStore = defineStore({
  id: "chat_store",
  state: () => ({
    chats: new Array<Chat>(),
    index: 0,
    chatMessage: new Map<string, Message[]>(),
    tempChatMessage: new Map<string, Message[]>(),
  }),
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: "chat",
        storage: myLocalStoreUtils,
        paths: ["index", "chats"],
      },
    ],
  },
  getters: {},
  actions: {
    /**
     * 重新加载聊历史记录
     */
    reloadChats() {
      const str = myLocalStoreUtils.getItem("chat");
      this.chats = str ? JSON.parse(str).chats : new Array<Chat>();
    },
    /**
     * 把一个消息推送到对应的聊天记录里面
     * @param message 消息
     */
    pushMessage(message: Message) {
      const i = this.getChatIndex(message.chatId);
      //说明该聊天对话框已经存在
      if (i > -1) {
        const chat = this.chats[i];
        this.addMessage(i, chat, message);
      } else {
        this.createChatRoom(message);
        this.addMessage(i, this.chats[0], message);
      }
    },
    /**
     * 把数据插入到消息的列表，有序插入
     * @param list list
     * @param message 消息
     */
    insertMessage(list: Message[], message: Message): void {
      if (list && list.length == 0) {
        list.push(message);
        return;
      }
      //重复数据,不予处理
      const repeat = list.findIndex((item) => {
        return item.id === message.id;
      });
      if (repeat > -1) {
        return;
      }
      //如果新消息的时间比历史数据的时间小
      const len = list.findIndex((n) => {
        return n.timestamp > message.timestamp;
      });
      //消息是在队列的中间，不在最后
      if (len > -1) {
        list.splice(len, 0, message);
      } else {
        list.push(message);
      }
    },
    /**
     * 创建一个新聊天室
     * @param message message
     * @private 私有方法
     */
    createChatRoom(message: Message) {
      if (message.type === ChatType.GROUP) {
        //先占位，后加载
        const chat: Chat = {
          id: message.chatId,
          name: "加载中...",
          avatar: "",
          type: ChatType.GROUP,
          lastMessage: message.content,
          unreadCount: 0,
          isLoading: false,
          loaded: true,
        };
        this.chats.unshift(chat);
        GroupApi.get(chat.id).then((group) => {
          const i = this.getChatIndex(chat.id);
          this.chats[i].name = group.data.name;
          this.chats[i].avatar = group.data.avatar;
        });
      } else {
        const chat: Chat = {
          id: message.chatId,
          name: "",
          avatar: "",
          type: ChatType.FRIEND,
          lastMessage: message.content,
          unreadCount: 0,
          isLoading: false,
          loaded: true,
        };
        this.chats.unshift(chat);
        UserApi.getUser(message.fromId).then((res) => {
          const i = this.getChatIndex(chat.id);
          this.chats[i].name = res.data.name;
          this.chats[i].avatar = res.data.avatar;
        });
      }
    },
    /**
     * 重置未读消息计数
     */
    reset() {
      this.chats.forEach((item: Chat) => {
        item.unreadCount = 0;
      });
    },
    /**
     * 添加消息
     * @param i 索引
     * @param chat 聊天室
     * @param message 消息
     * @private
     */
    addMessage(i: number, chat: Chat, message: Message) {
      //聊天对话框已经打开状态
      if (
        i === this.index &&
        "/index/chat" === router.currentRoute.value.fullPath
      ) {
        chat.unreadCount = 0;
        chat.lastMessage = message.mine ? "" : message.content;
        this.addToMessageList(message, chat.id);
      }
      //聊天对话框是没有打开状态
      else {
        //如果是自己发的消息，不用提醒，场景：转发
        if (message.fromId != userStore.getUser()?.id) {
          chat.unreadCount++;
        }
        chat.lastMessage = message.mine ? "" : message.content;
        this.addToMessageList(message, chat.id);
      }
    },

    /**
     * 打开一个聊天对话框
     * @param chat chat
     */
    openChat(chat: Chat) {
      let hasChat = false;
      this.chats.forEach((item, index) => {
        //聊天对话框已经存在
        if (item.id === chat.id) {
          this.index = index;
          item.unreadCount = 0;
          hasChat = true;
        }
      });
      //新增一个新聊天对话框
      if (!hasChat) {
        chat.unreadCount = 0;
        //添加到聊天列表第一个
        this.chats.unshift(chat);
        this.index = 0;
      }
    },

    /**
     * 根据聊天室的ID 获取他的index
     * @param id 聊天室的ID
     */
    getChatIndex(id: string) {
      let i = -1;
      this.chats.forEach((item, index) => {
        if (item.id === id) {
          i = index;
        }
      });
      return i;
    },

    /**
     * 限制聊天记录的数组的长度
     * @param message 新增的聊天消息
     * @param chatId 聊天室
     */
    addToMessageList(message: Message, chatId: string) {
      const messageList = this.chatMessage.get(chatId) ?? new Array<Message>();
      this.insertMessage(messageList, message);
      //当数组容量超过150时候，一次性删除50条，防止每次删除都刷新数组
      if (messageList.length > 150) {
        messageList.splice(0, 50);
      }
      this.chatMessage.set(chatId, messageList);
    },

    delChat(id: string) {
      this.chats.splice(this.getChatIndex(id), 1);
    },
  },
});
