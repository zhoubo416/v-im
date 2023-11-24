<template>
  <div class="v-im" v-if="currentUser">
    <div class="left-bar" style="-webkit-app-region: drag">
      <ul>
        <li class="userPhoto">
          <div @click="showUser(userStore.getUser().id, false)">
            <Avatar
              :img="userStore.getUser().avatar"
              :name="userStore.getUser().name"
            ></Avatar>
          </div>
        </li>
        <li title="会话">
          <router-link v-bind:to="'/index/chat'">
            <el-badge :value="unreadCount" :hidden="unreadCount === 0">
              <i class="iconfont icon-v-liaotian"></i>
            </el-badge>
          </router-link>
        </li>
        <li title="好友">
          <router-link v-bind:to="'/index/friend'">
            <i class="iconfont icon-v-haoyou"></i>
          </router-link>
        </li>
        <li title="组织">
          <router-link v-bind:to="'/index/dept'">
            <i class="iconfont icon-v-bumen"></i>
          </router-link>
        </li>
        <li title="群">
          <router-link v-bind:to="'/index/group'">
            <i class="iconfont icon-v-qunzhong"></i>
          </router-link>
        </li>
        <li title="设置">
          <router-link v-bind:to="'/index/system/user'">
            <i class="iconfont icon-v-shezhi"></i>
          </router-link>
        </li>
        <li title="退出" class="logout" @click="vimLogout">
          <i class="iconfont icon-v-weibiaoti2"></i>
        </li>
      </ul>
    </div>
    <router-view v-slot="{ Component }" class="content">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import showUser from "@/components/user-modal/";
import Avatar from "@/components/Avatar.vue";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import AccountApi from "@/api/AccountApi";

import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
} from "vue";
import Auth from "@/api/Auth";
import Message from "@/mode/Message";
import ChatType from "@/config/ChatType";
import ChatUtils from "@/utils/ChatUtils";
import vimConfig from "@/config/VimConfig";
import { ElMessageBox } from "element-plus/es";
import { logout } from "@/api/Login";
import router from "@/router";

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const chatStore = useChatStore();
const currentUser = userStore.getUser();
if (!currentUser) {
  AccountApi.toLogin();
}
const userConf = reactive({
  show: false,
  userId: "",
});
const unreadCount = computed(() => {
  let i = 0;
  chatStore.chats.forEach((item) => {
    i = i + item.unreadCount;
  });
  return i;
});

const vimLogout = () => {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    logout().then(() => {
      proxy.$ws.close();
      AccountApi.toLogin();
    });
  });
};

onMounted(() => {
  if (currentUser) {
    //初始化websocket
    chatStore.reset();
    proxy.$ws.init(
      vimConfig.wsProtocol +
        "://" +
        Auth.getIp() +
        ":" +
        vimConfig.wsPort +
        "?token=" +
        Auth.getToken()
    );
    //重写 onmessage 方法，收到的消息都在这里进行分发
    proxy.$ws.onmessage = (message: Message) => {
      //群聊里面，自己发的消息不再显示
      if (currentUser.id === message.fromId) {
        message.mine = true;
      } else {
        proxy.$winControl.default.flashIcon();
        proxy.$winControl.default.flashFrame();
      }
      //友聊换chatId,chatId 不一样
      if (
        ChatType.FRIEND === message.type &&
        currentUser.id !== message.fromId
      ) {
        message.chatId = message.fromId;
      }
      chatStore.pushMessage(message);

      nextTick(() => {
        ChatUtils.imageLoad("message-box");
      });
    };
    userConf.userId = currentUser.id;
  }
});
</script>
<style lang="scss" scoped>
.v-im {
  display: flex;
  flex-direction: row;

  .left-bar {
    background-color: #1c2438;
    width: 6rem;
    height: 100%;

    ul {
      padding: 3rem 1.2rem 1.2rem 1.2rem;
      list-style: none;
      height: 100%;
      position: relative;

      li {
        -webkit-app-region: no-drag;
        display: block;
        width: 3.6rem;
        height: 3.6rem;
        text-align: center;
        margin-bottom: 2rem;
        cursor: pointer;

        a {
          display: block;
          text-decoration: none;
        }

        .iconfont {
          font-size: 3.6rem !important;
          color: #999999;
          margin: 0.2rem;
          cursor: pointer;

          &:hover {
            color: #ffffff;
          }
        }

        .router-link-active {
          .iconfont {
            color: #ffffff;
          }
        }
      }

      .logout {
        bottom: 0;
        position: absolute;
      }

      .userPhoto {
        margin-bottom: 3rem;

        .my-avatar {
          width: 100%;
        }

        img {
          width: 3.6rem;
          height: 3.6rem;
        }
      }
    }
  }

  .content {
    flex: 1;
  }
}
</style>
