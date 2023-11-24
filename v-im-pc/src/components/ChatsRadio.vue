<template>
  <el-row :gutter="10">
    <el-col :span="12" style="background-color: #f8f8f8">
      <el-checkbox-group v-model="rightArr" @change="change">
        <div
          v-for="chat in chatStore.chats"
          :key="chat.id"
          style="height: 60px"
        >
          <el-checkbox :label="chat">
            <template #default>
              <div class="check-item">
                <div class="check-item-avatar">
                  <Avatar :img="chat.avatar" :name="chat.name"></Avatar>
                </div>
                <div class="check-item-name">
                  {{ chat.name }}
                </div>
              </div>
            </template>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </el-col>
    <el-col :span="12">
      <div v-for="chat in rightArr" :key="chat.id" style="height: 60px">
        <div class="check-item">
          <div class="check-item-avatar">
            <Avatar :img="chat.avatar" :name="chat.name"></Avatar>
          </div>
          <div class="check-item-name">
            {{ chat.name }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chatStore";
import { defineEmits, ref } from "vue";
import Avatar from "@/components/Avatar.vue";
const emit = defineEmits(["setData"]);
const chatStore = useChatStore();
const rightArr = ref([]);

const change = () => {
  emit("setData", rightArr.value);
};
</script>

<style lang="scss" scoped>
.check-item {
  display: flex;

  .check-item-avatar {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar {
      height: 40px;
      width: 40px;
    }
  }

  .check-item-name {
    flex: 6;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 15px;
  }
}
</style>
