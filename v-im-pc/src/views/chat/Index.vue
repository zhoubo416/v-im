<template>
  <div class="main">
    <div class="left">
      <div class="title">
        <el-row>
          <el-col :span="24">
            <el-input v-model="keyword" placeholder="搜索"></el-input>
          </el-col>
        </el-row>
      </div>
      <el-scrollbar class="list" v-if="show">
        <template v-if="keywordFilter(store.chats, keyword).length > 0">
        <chat-item
                  v-for="(chat, index) in keywordFilter(store.chats, keyword)"
                  :key="chat.id"
                  :index="index"
                  :id="chat.id"
                  :img="chat.avatar"
                  :username="chat.name"
                  :unreadCount="chat.unreadCount"
                  :text="chat.lastMessage"
                  :showDel="true"
                  :is-group="chat.type === ChatType.GROUP"
                  :active="index === store.index"
                  @del="delChat"
                  @click="showChat(chat)"
                ></chat-item>
        </template>
        <template v-else>
        <div style="margin:10px">请先添加好友</div>
        </template>

      </el-scrollbar>
    </div>
    <div class="right">
      <Top></Top>
      <chat-message v-if="chat"></chat-message>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chatStore";
import Chat from "@/mode/Chat";
import ChatMessage from "@/views/chat/ChatMessage.vue";
import Top from "@/components/Top.vue";
import ChatItem from "@/components/ChatItem.vue";
import { computed, nextTick, onMounted, ref } from "vue";
import ChatUtils from "@/utils/ChatUtils";
import ChatType from "@/config/ChatType";
import keywordFilter from "@/utils/PinYinUtils";

const keyword = ref("");
const chatStore = useChatStore();
const store = useChatStore();
const show = ref<boolean>(false);
const chat = computed((): Chat => {
  return chatStore.chats[chatStore.index];
});
const showChat = (chat: Chat) => {
  store.openChat(chat);
  nextTick(() => {
    ChatUtils.imageLoad("message-box");
  });
};
const delChat = (id: string) => {
  store.delChat(id);
};
onMounted(() => {
  show.value = true;
});
</script>

<style lang="scss" scoped></style>
