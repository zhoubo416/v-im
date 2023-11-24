<template>
  <el-dialog
    v-model="show"
    title="添加好友"
    width="400px"
    :before-close="handleClose"
  >
    <div>
      <el-form-item label="手机号">
        <el-input
          v-model="mobile"
          placeholder="请输入完整手机号"
          class="input-with-select"
        >
          <template #append>
            <el-button @click="search">查找</el-button>
          </template>
        </el-input>
      </el-form-item>
      <div
        v-for="(user, index) in users"
        :key="index"
        class="solid"
        :class="checkUser.id === user.id ? 'active' : ''"
        @click="check(user)"
      >
        <chat-item
          :id="user.id"
          :img="user.avatar"
          :username="user.name"
          :showDel="false"
        ></chat-item>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import UserApi from "@/api/UserApi";
import ChatItem from "@/components/ChatItem.vue";
import User from "@/mode/User";
import { ElMessage } from "element-plus/es";
import addFriend from "@/components/add-friend-modal/";
const emit = defineEmits(["close"]);
const mobile = ref("");
const users = ref<Array<User>>([]);
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const handleClose = () => {
  emit("close");
};

const show = computed(() => {
  return props.dialogVisible;
});

const reset = () => {
  mobile.value = "";
  users.value = [];
};

const checkUser = ref<User>({
  id: "",
  name: "",
  avatar: "",
  mobile: "",
  email: "",
  canAddFriend: "",
  deptId: "",
  sex: "",
});

const check = (user: User) => {
  checkUser.value = user;
};
const close = () => {
  reset();
  emit("close");
};
const search = () => {
  if (mobile.value.trim().length != 11) return;
  UserApi.search(mobile.value.trim()).then((res) => {
    users.value = res.data;
  });
};

const add = () => {
  if (checkUser.value.id !== "") {
    close();
    addFriend(checkUser.value.id);
  } else {
    ElMessage.error("请选择一个用户");
  }
};
</script>
<style scoped>
.solid {
  border: 1px solid #eeeeee;
  padding-top: 10px;
}

.solid.active {
  border: 1px solid #1d86f1;
  padding-top: 10px;
}
</style>
