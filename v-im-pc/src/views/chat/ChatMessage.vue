<template>
  <div class="im-chat" v-if="chat">
    <div class="im-chat-top">
      <div>
        <span>{{ chat.name }}</span>
        <span v-if="chat.type === ChatType.GROUP">（{{ count }}人）</span>
      </div>
      <a
        v-if="chat.type === ChatType.FRIEND"
        href="javascript:;"
        @click="showUser(chat.id, false)"
        class="pull-right menu"
      >
        <i class="iconfont icon-v-xinxi" />
      </a>
      <a
        v-else
        href="javascript:;"
        @click="showGroup(chat.id, false)"
        class="pull-right menu"
      >
        <i class="iconfont icon-v-xinxi" />
      </a>
    </div>
    <div class="im-chat-main">
      <div class="im-chat-main-left">
        <div class="im-chat-main-box messages" id="message-box">
          <ul>
            <li
              v-for="item in messageList"
              :key="item.id"
              :class="{ 'im-chat-mine': item.fromId === user?.id }"
            >
              <div class="im-chat-user">
                <Avatar
                  :img="userMap.get(item.fromId)?.avatar"
                  :name="userMap.get(item.fromId)?.name"
                />
                <div class="message-info right" v-if="item.fromId === user?.id">
                  <i>
                    <Time :time="item.timestamp" />
                  </i>
                  <span>{{ userMap.get(item.fromId)?.name }}</span>
                </div>
                <div class="message-info" v-if="item.fromId !== user?.id">
                  <span>{{ userMap.get(item.fromId)?.name }}</span>
                  <i>
                    <Time :time="item.timestamp" />
                  </i>
                </div>
              </div>
              <div
                class="im-chat-text"
                @contextmenu.prevent="onContextmenu(item, $event)"
                data-id="item.id"
                v-if="item.messageType === MessageType.text"
              >
                <pre v-html="ChatUtils.transform(item.content)"></pre>
              </div>
              <div
                class="im-chat-text"
                @contextmenu.prevent="onContextmenu(item, $event)"
                v-if="item.messageType === MessageType.image"
                style="width: 300px; line-height: 100%; font-size: inherit"
              >
                <img
                  :src="item.extend.url"
                  style="width: 100%"
                  v-on:click="openImageProxy($event)"
                />
              </div>
              <div
                class="im-chat-text"
                @contextmenu.prevent="onContextmenu(item, $event)"
                v-if="item.messageType === MessageType.file"
                style="width: 50%"
              >
                <a
                  class="file-box"
                  :title="item.extend.fileName"
                  :href="item.extend.url"
                  v-on:click="openImageProxy($event)"
                >
                  <div class="file-icon">
                    <i class="iconfont icon-v-xiazai"></i>
                  </div>
                  <div class="file-text">
                    <div class="file-name">{{ item.extend.fileName }}</div>
                  </div>
                </a>
              </div>
              <div
                class="im-chat-text"
                @contextmenu.prevent="onContextmenu(item, $event)"
                v-if="item.messageType === MessageType.voice"
                :style="{
                  width:
                    item.extend.time > 40 ? '50%' : item.extend.time + 10 + '%',
                }"
              >
                <div @click="handleAudio(item)">
                  <i
                    class="iconfont icon-v-voice"
                    :class="{ 'icon-v-voice-right': item.mine }"
                  ></i>
                </div>
              </div>
            </li>
          </ul>
          <!--播放语音-->
          <audio ref="Audio"></audio>
        </div>
        <div class="im-chat-footer">
          <div class="im-chat-tool">
            <i class="iconfont icon-v-smile" @click="showFace = !showFace"></i>
            <upload
              :is-img="true"
              :fileTypes="['png', 'jpg', 'jpeg', 'gif']"
              @uploadSuccess="uploadSuccess"
            >
              <i class="iconfont icon-v-tupian"></i>
            </upload>
            <upload
              :is-img="false"
              :fileTypes="['doc', 'docx', 'xls', 'xlsx', 'pdf', 'zip', 'rar']"
              @uploadSuccess="uploadSuccess"
            >
              <i class="iconfont icon-v-folderHeart"></i>
            </upload>
            <faces
              v-if="showFace"
              @click="showFace = false"
              class="faces-box"
              @insertFace="insertFace"
            ></faces>
            <el-button
              class="history-message-btn"
              size="small"
              @click="history()"
              >聊天记录
            </el-button>
          </div>
          <textarea
            v-model="messageContent"
            class="textarea"
            @keyup.enter="mineSend()"
          ></textarea>
          <div class="im-chat-send">
            <el-button type="primary" @click="mineSend()" v-if="isGroupUser"
              >发送
            </el-button>
            <el-button type="primary" v-if="!isGroupUser" disabled
              >不在群内
            </el-button>
          </div>
        </div>
      </div>
      <div class="im-chat-users" v-if="chat.type === ChatType.GROUP">
        <el-scrollbar class="chat-user-list">
          <div
            class="user"
            v-for="item in users"
            :key="item.id"
            @click="showUser(item.id, true)"
          >
            <Avatar :img="item.avatar" :name="item.name" />
            {{ item.name }}
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>

  <el-drawer
    v-model="showHistory"
    title="聊天记录"
    :with-header="false"
    size="60%"
  >
    <history-message
      :from-id="userStore.user.id"
      :chat-users="userMap"
      :chat-id="chat.id"
      :type="chat.type"
      :showHistory="showHistory"
    ></history-message>
  </el-drawer>
  <!-- 右键菜单 -->
  <right-menu
    :class-index="0"
    :rightClickInfo="rightClickInfo"
    @retransmission="showRetransmission"
  ></right-menu>
  <el-dialog
    width="500px"
    v-model="dialogVisible"
    :show-close="false"
    :destroy-on-close="true"
    title="消息转发"
  >
    <div style="max-height: 300px; overflow-y: scroll; padding: 20px 5px">
      <chats-radio @setData="setData"></chats-radio>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="retransmission">转发</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import Avatar from "@/components/Avatar.vue";
import Time from "@/components/Time.vue";
import Faces from "@/components/Faces.vue";
import HistoryMessage from "@/components/HistoryMessage.vue";
import Chat from "@/mode/Chat";
import Message from "@/mode/Message";
import ChatUtils from "@/utils/ChatUtils";
import ChatType from "@/config/ChatType";
import Upload from "@/components/upload/Upload.vue";
import GroupApi from "@/api/GroupApi";
import User from "@/mode/User";
import MessageApi from "@/api/MessageApi";
import Receipt from "@/mode/Receipt";
import MessageType from "@/utils/MessageType";
import UserApi from "@/api/UserApi";
import { storeToRefs } from "pinia";
import { logout } from "@/api/Login";
import showUser from "@/components/user-modal";
import showGroup from "@/components/group-modal";
import RightMenu from "@/components/menu/RightMenu";
import ChatsRadio from "@/components/ChatsRadio";
import { h } from "vue";
import { ElNotification } from "element-plus";
import AccountApi from "@/api/AccountApi";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { proxy } = getCurrentInstance();
const chatStore = useChatStore();
const userStore = useUserStore();

//是否展示表情
const showFace = ref(false);
//转发
const dialogVisible = ref(false);
//展示用户信息
const show = ref(false);
//群人数
const count = ref(0);

//语音
const Audio = ref();

//控制播放还是暂停音频文件
const handleAudio = (item: Message) => {
  if (Audio.value.paused) {
    Audio.value.src = item.extend.url;
    Audio.value.play();
  } else {
    Audio.value.src = "";
    Audio.value.stop();
  }
};

//用户
const users = ref<Array<User>>();

//是否展示聊天记录
const showHistory = ref(false);

//是否是群成员，如果是群聊天，并且已经被踢出群，不能再有发送按钮
const isGroupUser = ref(true);
//当前聊天
const chat = computed((): Chat => {
  return chatStore.chats[chatStore.index];
});
const user = userStore.getUser();
if (user) {
  userStore.storeUser(user.id, {
    name: user.name,
    avatar: user.avatar,
  });
}
if (!user) {
  logout().then(() => {
    proxy.$ws.close();
    AccountApi.toLogin();
  });
}
//聊天对象,
const { userMap } = storeToRefs(userStore);

if (chat.value && chat.value.type === ChatType.FRIEND) {
  UserApi.getUser(chat.value.id).then((res) => {
    const chatUser = res.data;
    userStore.storeUser(chatUser.id, {
      name: chatUser.name,
      avatar: chatUser.avatar,
    });
  });
}

watch(
  chat,
  (n) => {
    isGroupUser.value = true;
    if (n && chat.value.type === ChatType.GROUP) {
      GroupApi.users(n.id).then((res) => {
        res.data.forEach((item: User) => {
          userStore.storeUser(item.id, {
            name: item.name,
            avatar: item.avatar,
          });
        });
        users.value = res.data;
        count.value = res.data.length;
        isGroupUser.value =
          users.value?.find((item) => item.id === user?.id) !== undefined;
      });
    }
    if (n && user) {
      //第一次加载，从数据库中取100条，有序插入到聊天记录里
      MessageApi.list(n.id, user.id, n.type, 100).then((res) => {
        //读取消息
        readMessage();
        res.data.forEach((item: Message) => {
          chatStore.addToMessageList(item, n.id);
          nextTick(() => {
            ChatUtils.imageLoad("message-box");
          });
        });
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const messageList = computed((): Array<Message> => {
  return chatStore.chatMessage.get(chat.value.id) ?? new Array<Message>();
});

/**
 * 用户点击消息列表某一个人,表示已经读取此人发送的所有的消息
 */
const readMessage = () => {
  if (user) {
    let receipt: Receipt = {
      chatId: chat.value.id,
      userId: user.id,
      timestamp: new Date().getTime(),
      type: chat.value.type,
    };
    proxy.$ws.sendRead(receipt);
  }
};

// 附件和图片点击展开
const openImageProxy = (event: any) => {
  event.preventDefault();
  const target = event.currentTarget;
  if (target.nodeName === "IMG") {
    proxy.$winControl.default.openURL(event.target.src);
  } else if (target.className === "file-box" || target.nodeName === "A") {
    proxy.$winControl.default.openURL(target.href);
  }
};

const messageContent = ref("");
const mineSend = (): void => {
  if (messageContent.value && messageContent.value.trim() !== "") {
    if (user) {
      let msg: Message = {
        messageType: MessageType.text,
        chatId: chat.value.id,
        fromId: user.id,
        // avatar: user.avatar,
        // name: user.name,
        mine: true,
        timestamp: new Date().getTime(),
        content: messageContent.value,
        type: chat.value.type,
      };
      proxy.$ws.sendMessage(msg);
      messageContent.value = "";
      nextTick(() => {
        ChatUtils.imageLoad("message-box");
      });
    }
  }
};

//添加表情
const insertFace = (item: string) => {
  messageContent.value = messageContent.value + "face" + item;
  showFace.value = false;
};

//上传成功
const uploadSuccess = (extend: string, messageType: string) => {
  if (user) {
    let msg: Message = {
      messageType: messageType,
      chatId: chat.value.id,
      fromId: user.id,
      mine: true,
      content: "",
      type: chat.value.type,
      extend: extend,
    };
    proxy.$ws.sendMessage(msg);
  }
};

//历史聊天记录
const history = () => {
  showHistory.value = !showHistory.value;
};

onMounted(() => {
  nextTick(() => {
    ChatUtils.imageLoad("message-box");
  });
});
//右键
const rightClickInfo = ref();
//右键
const onContextmenu = (item: Message, e: any) => {
  rightClickInfo.value = {
    position: {
      x: e.clientX,
      y: e.clientY,
    },
    menuLists: [
      {
        fnName: "retransmission",
        params: item,
        icoName: "el-icon-star-on",
        btnName: "转发",
      },
    ],
  };
};
//转发的聊天对象
const toChats = ref([] as Chat[]);
const msg = ref({} as Message);
//展示转发按钮
const showRetransmission = (message: Message) => {
  dialogVisible.value = true;
  msg.value = message;
};
//转发
const retransmission = () => {
  dialogVisible.value = false;
  let tempMsg: Message = JSON.parse(JSON.stringify(msg.value));
  toChats.value.forEach((item) => {
    if (null !== userStore.user) {
      tempMsg.chatId = item.id;
      tempMsg.fromId = userStore.user.id;
      tempMsg.type = item.type;
      tempMsg.mine = true;
      proxy.$ws.sendMessage(tempMsg);
      ElNotification({
        title: "提示",
        message: h("i", { style: "color: teal" }, "转发成功"),
      });
    }
  });
};
//子组件往父组件传递的值
const setData = (data: Chat[]) => {
  toChats.value = data;
};
</script>

<style lang="scss">
.right-menu {
  position: absolute;
  z-index: 999;
  background-color: #69cbe9;
  display: inline-block;
}

.im-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.im-chat-top {
  border-bottom: 1px solid #cccccc;
  color: $color-default;
  padding: 0 0 0.2rem 1rem;
  font-size: 1.6rem;
  font-weight: bold;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .menu {
    color: $color-default;
    display: inline-block;
    padding: 0 10px;
  }
}

.user-model {
  .user-model-img {
    padding: 15px;
    text-align: center;

    img {
      border-radius: 50%;
    }
  }

  .user-model-item {
    display: flex;
    padding: 5px 0;

    label {
      flex: 2;
      font-weight: bold;
      text-align: right;
    }

    span {
      flex: 3;
    }
  }
}

.im-chat-main {
  flex: 1;
  display: flex;
  flex-direction: row;
  height: calc(100% - 40px);

  .im-chat-main-left {
    flex: 4;
    display: flex;
    flex-direction: column;

    .im-chat-main-box {
      flex: 1;
      padding: 1rem 1rem 0 1rem;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .message-img {
    max-width: 20rem;
  }

  .im-chat-users {
    width: 180px;
    border-left: 1px solid #cccccc;

    .chat-user-list {
      list-style: none;
      margin: 0;

      .user {
        cursor: pointer;
        padding: 5px 2px;
        position: relative;
        display: flex;
        align-items: center;

        &:hover {
          background-color: #eeeeee;

          &:after {
            content: "...";
            position: absolute;
            right: 10px;
            font-weight: bold;
          }
        }

        & > .im-chat-avatar {
          width: 3.2rem;
          height: 3.2rem;
          display: inline-block;
          vertical-align: middle;

          & > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .messages {
    width: 100%;
    height: calc(100% - 3rem);
    overflow-y: scroll;

    ul {
      width: 100%;

      li {
        position: relative;
        font-size: 0;
        margin-bottom: 10px;
        padding-left: 60px;
        min-height: 68px;

        .im-chat-text {
          position: relative;
          line-height: 150%;
          margin-top: 25px;
          padding: 1rem;
          background-color: #e2e2e2;
          border-radius: 3px;
          color: #333;
          word-break: break-all;
          display: inline-block;
          vertical-align: top;
          font-size: 14px;

          &:after {
            content: "";
            position: absolute;
            left: -10px;
            top: 13px;
            width: 0;
            height: 0;
            border-style: solid dashed dashed;
            border-color: #e2e2e2 transparent transparent;
            overflow: hidden;
            border-width: 10px;
          }

          pre {
            width: 100%;
            white-space: pre-wrap;
            word-break: break-all;

            img {
              display: block;
            }
          }
        }
      }
    }

    .im-chat-user {
      width: 4rem;
      height: 4rem;
      position: absolute;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      left: 3px;
      right: auto;

      .message-info {
        position: absolute;
        left: 60px;
        top: -2px;
        width: 500px;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        color: #999;
        text-align: left;
        font-style: normal;

        i {
          font-style: normal;
          padding-left: 15px;
        }
      }

      .right {
        right: 0;
        text-align: right;
        left: auto;

        i {
          padding-right: 15px;
        }
      }

      img {
        width: 4rem;
        height: 4rem;
      }
    }

    .im-chat-mine {
      text-align: right;
      padding-left: 0;
      padding-right: 60px;

      .im-chat-text {
        margin-left: 10px;
        text-align: left;
        background-color: $color-message-bg;
        color: #fff;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:after {
          left: auto;
          right: -10px;
          border-top-color: $color-message-bg;
        }
      }

      .im-chat-user {
        left: auto;
        right: 3px;

        cite {
          left: auto;
          right: 60px;
          text-align: right;

          i {
            padding-left: 0;
            padding-right: 15px;
          }
        }

        .message-info {
          right: 60px !important;
          display: inline-block;
        }
      }
    }
  }
}

.im-chat-footer {
  border-top: 1px solid $color-gray;
  height: 15rem;
  display: flex;
  flex-direction: column;

  .im-chat-tool {
    padding: 0.5rem 1rem;
    height: 3.4rem;
    position: relative;

    i {
      font-size: 2rem;
      cursor: pointer;
      margin: 1rem;
    }

    .faces-box {
      position: absolute;
      bottom: 3.8rem;
    }

    .ivu-upload {
      display: inline-block;
    }

    .history-message-btn {
      float: right;
    }
  }

  textarea {
    border: 0;
    padding: 0.5rem;
    width: 100%;
    flex: 1;
    resize: none;
    background-color: $color-box-bg !important;

    &:focus {
      border: 0;
    }
  }

  .im-chat-send {
    height: 4rem;
    text-align: right;
    padding: 0 1rem 1rem 0;
  }
}

.ivu-scroll-wrapper {
  margin: 0 !important;
}

.ivu-scroll-container {
  padding: 15px 15px 5px;
  overflow-y: visible !important;
}

/* 重新覆盖iview 里面的 model 小于768px 时候 宽度变100% 的问题 */
@media (max-width: 768px) {
  .user-model {
    .ivu-modal {
      width: 30rem !important;
      margin: 0 auto;
    }
  }
}

.history-message {
  width: 80%;
  height: calc(100% - 30px);
}

.page {
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0.5rem;
}

.ivu-drawer-body {
  padding: 0 !important;

  .messages {
    height: calc(100% - 3rem);
  }
}

.model-footer {
  text-align: right;
  margin: 10px;
}

.file-box {
  width: 100%;
  display: flex;
  background-color: #efefef;
  color: #666666;

  .file-icon {
    background-color: #cccccc;
    padding: 10px;
    flex: 1;
    flex-shrink: 0;

    .iconfont {
      line-height: normal;
      font-size: 4rem;
    }
  }

  .file-text {
    width: 0;
    padding: 10px;
    flex: 5;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    overflow: hidden;

    .file-name {
      -webkit-line-clamp: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      overflow-wrap: break-word;
      word-break: break-all;
    }
  }
}

.icon-v-voice-right:after {
  transform: rotate(180deg) !important;
}
</style>
