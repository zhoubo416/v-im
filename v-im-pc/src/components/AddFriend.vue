<template>
  <el-dialog
    v-model="show"
    title="添加好友"
    width="400px"
    :before-close="handleClose"
  >
    <div>
      <el-form-item label="搜索">
        <el-input
          v-model="mobile"
          class="w-50 m-1"
          placeholder="请输入手机号或昵称回车"
          :suffix-icon="Search"
          @blur="search"
          @keyup.enter.down="search"
        />
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
import { computed, defineEmits, defineProps, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import UserApi from "@/api/UserApi";
import ChatItem from "@/components/ChatItem.vue";
import User from "@/mode/User";
import FriendApi from "@/api/FriendApi";
import { ElMessage } from "element-plus/es";

const emit = defineEmits(["close"]);

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

const checkUser = ref({});
const mobile = ref("");
const users = ref<Array<User>>([]);

const check = (user: User) => {
  checkUser.value = user;
};
const close = () => {
  emit("close");
};
const search = () => {
  if (mobile.value.trim().length < 2) return;
  UserApi.searchMatch(mobile.value.trim()).then((res) => {
    users.value = res.data;
  });
};

const add = () => {
  if (checkUser.value && users.value.length > 0) {
    let user = checkUser.value;
    FriendApi.add(user.id)
      .then(() => {
        ElMessage.info("添加成功");
        emit("close");
      })
      .catch((res) => {
        console.error(res);
      });
  } else {
    ElMessage.error("请选择一个用户");
  }
};

onMounted(() => {
  console.log(show.value);
});
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
