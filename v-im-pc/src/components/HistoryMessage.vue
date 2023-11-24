<template>
  <div class="im-chat-main" style="background-color: #f8f8f8">
    <div class="messages" id="his-chat-message" style="height: 100%">
      <ul>
        <li
          v-for="(item, index) in hisMessageList"
          :key="index"
          :class="{ 'im-chat-mine': item.fromId === currentUser.id }"
        >
          <div class="im-chat-user" id="historyMessageBox">
            <avatar
              :img="chatUsers.get(item.fromId)?.avatar"
              :name="chatUsers.get(item.fromId)?.name"
            />
            <div
              class="message-info right"
              v-if="item.fromId === currentUser.id"
            >
              <i> <Time :time="item.timestamp" /></i>
              <span>{{ chatUsers.get(item.fromId)?.name }}</span>
            </div>
            <div class="message-info" v-if="item.fromId !== currentUser.id">
              <span>{{ chatUsers.get(item.fromId)?.name }}</span>
              <i> <Time :time="item.timestamp" /></i>
            </div>
          </div>
          <div
            class="im-chat-text"
            v-if="item.messageType === MessageType.text"
          >
            <pre v-html="ChatUtils.transform(item.content)"></pre>
          </div>
          <div
            class="im-chat-text"
            v-if="item.messageType === MessageType.image"
            style="width: 300px"
          >
            <img
              :src="item.extend.url"
              style="width: 100%"
              v-on:click="openImageProxy($event)"
            />
          </div>
          <div
            class="im-chat-text"
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
    </div>
  </div>
  <el-pagination
    background
    v-model:currentPage="current"
    :page-size="size"
    layout="prev, pager, next"
    :total="total"
    @current-change="change"
  >
  </el-pagination>
</template>

<script setup lang="ts">
import {
  defineProps,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import MessageApi from "@/api/MessageApi";
import Avatar from "@/components/Avatar.vue";
import Time from "@/components/Time.vue";
import ChatUtils from "@/utils/ChatUtils";
import MessageType from "@/utils/MessageType";
import { useUserStore } from "@/store/userStore";
import Message from "@/mode/Message";

const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const size = ref(10);
const currentUser = userStore.getUser();
const props = defineProps({
  chatUsers: {
    type: Map,
    required: true,
    default: {},
  },
  chatId: {
    type: String,
    required: true,
    default: "",
  },
  fromId: {
    type: String,
    required: true,
    default: "",
  },
  type: {
    type: String,
    required: true,
    default: "",
  },
  showHistory: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const data = reactive({
  hisMessageList: [],
  current: 1,
  total: 0,
});

// 附件和图片点击展开
const openImageProxy = (event: any) => {
  event.preventDefault();
  if (event.target.nodeName === "IMG") {
    proxy.$winControl.default.openURL(event.target.src);
  } else if (
    event.target.className === "message-file" ||
    event.target.nodeName === "A"
  ) {
    proxy.$winControl.default.openURL(event.target.href);
  }
};

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
const change = (current: number) => {
  MessageApi.page(
    props.chatId,
    props.fromId,
    props.type,
    "",
    current,
    size.value
  ).then((res) => {
    data.hisMessageList = res.data.records.reverse();
    console.log(res.data.records);
    data.total = res.data.total;
    data.current = current;
    nextTick(() => {
      ChatUtils.imageLoad("his-chat-message");
    });
  });
};

watch(
  () => {
    return props.showHistory;
  },
  (n) => {
    if (n) {
      change(1);
    }
  },
  {
    immediate: true,
  }
);
const { hisMessageList, current, total } = toRefs(data);
</script>

<style scoped></style>
