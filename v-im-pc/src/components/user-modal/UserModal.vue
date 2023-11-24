<template>
  <teleport to="#modal">
    <el-dialog
      width="40rem"
      center
      :show-close="false"
      :close-on-click-modal="false"
      @close="close"
      v-model="open"
    >
      <div class="info" v-if="user">
        <Avatar :img="user.avatar" :name="user.name"></Avatar>
        <el-descriptions class="description" :column="2">
          <el-descriptions-item label="姓名"
            >{{ user.name }}
          </el-descriptions-item>
          <el-descriptions-item label="性别"
            >{{ user.sex === "0" ? "男" : "女" }}
          </el-descriptions-item>
          <el-descriptions-item label="电话"
            >{{ user.mobile }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱"
            >{{ user.email }}
          </el-descriptions-item>
          <el-descriptions-item label="部门" role="2">
            <span v-for="(item, index) in depts" :key="index"
              >{{ item.name }},</span
            >
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">关闭</el-button>
          <el-button v-if="!isFriend" type="info" @click="addFriend()"
            >加好友</el-button
          >
          <el-button v-if="showSend" type="primary" @click="send()"
            >聊天</el-button
          >
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import Avatar from "@/components/Avatar.vue";
import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";
import UserApi from "@/api/UserApi";
import DeptApi from "@/api/DeptApi";
import FriendApi from "@/api/FriendApi";
import Dept from "@/mode/Dept";
import User from "@/mode/User";
import ChatType from "@/config/ChatType";
import { ElMessage } from "element-plus/es";

const router = useRouter();
const store = useChatStore();
const userStore = useUserStore();
const isFriend = ref(true);
const open = ref(false);

const props = defineProps({
  userId: {
    type: String,
    required: true,
    default: null,
  },
  showSend: {
    type: Boolean,
    required: false,
    default: false,
  },
  closeDialog: {
    type: Function,
    default: null,
  },
});

const user = ref<User>();
const depts = ref(new Array<Dept>());

const getIsFriend = () => {
  FriendApi.isFriend(props.userId).then((res) => {
    isFriend.value = res.data;
    if (props.userId === userStore.getUser()?.id) {
      isFriend.value = true;
    }
  });
};
const getUser = () => {
  UserApi.getUser(props.userId).then((res) => {
    user.value = res.data;
    if (res.data.deptId == null || res.data.deptId === "null") {
      return;
    } else {
      return DeptApi.parent(res.data.deptId).then((res) => {
        depts.value.splice(0, depts.value.length);
        res.data.forEach((item: Dept) => {
          depts.value.push(item);
        });
      });
    }
  });
};

onMounted(() => {
  if (props.userId) {
    open.value = true;
    getUser();
    getIsFriend();
  }
});

const close = () => {
  props.closeDialog();
};

const addFriend = () => {
  if (!isFriend.value) {
    FriendApi.add(props.userId)
      .then(() => {
        isFriend.value = true;
        ElMessage.success("添加好友成功");
      })
      .catch(() => {
        ElMessage.error("添加好友失败");
      });
  }
};

const send = () => {
  props.closeDialog();
  if (user.value) {
    store.openChat({
      id: user.value.id,
      name: user.value.name,
      avatar: user.value.avatar,
      type: ChatType.FRIEND,
      lastMessage: "",
      unreadCount: 0,
      isLoading: false,
      loaded: true,
    });
  }
  router.push("/index/chat");
};
</script>

<style scoped lang="scss">
.info {
  text-align: center;
  line-height: 200%;
}

.description {
  padding: 20px 20px 0 20px;
  background-color: #ffffff;
}
</style>
