<template>
  <el-main v-loading="loading" class="dept-box">
    <el-scrollbar height="100%">
      <div class="users" v-if="users.length > 0">
        <div class="users-grid">
          <div
            v-for="user in users"
            :key="user.id"
            class="user"
            @click="showUser(user.id, true)"
            :title="user.name"
          >
            <Avatar :img="user.avatar" :name="user.name"></Avatar>
            <div class="username">{{ user.name }}</div>
          </div>
        </div>
      </div>
      <el-result icon="info" v-if="users.length === 0">
        <template #sub-title>
          <p>此部门暂时没有用户哦！</p>
        </template>
      </el-result>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from "vue";
import User from "@/mode/User";
import Avatar from "@/components/Avatar.vue";
import showUser from "@/components/user-modal";
import { useRoute } from "vue-router";
import DeptApi from "@/api/DeptApi";

const route = useRoute();
const loading = ref(true);
const data = reactive({
  users: new Array<User>(),
});
const deptId = route.params.id;

if (typeof deptId === "string") {
  loading.value = true;
  DeptApi.users(deptId)
    .then((res) => {
      res.data.forEach((item: User) => {
        data.users.push(item);
      });
    })
    .finally(() => {
      loading.value = false;
    });
}

const { users } = toRefs(data);
</script>

<style scoped lang="scss">
.dept-box {
  background-color: #ffffff;
  height: calc(100% - 70px);
  padding: 0 !important;
  box-sizing: border-box;
}

.users {
  padding: 18px;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, 100px);
    grid-template-rows: repeat(auto-fit, 80px);
    grid-row-gap: 15px;
    grid-column-gap: 15px;
  }

  .user {
    text-align: center;
    cursor: pointer;
    padding: 10px;
    border: 1px solid #cccccc;

    .username {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
