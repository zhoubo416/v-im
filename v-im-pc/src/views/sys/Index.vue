<template>
  <div class="main">
    <div class="left">
      <div class="title">
        <el-row>
          <el-col :span="20">
            <div class="text">设置</div>
          </el-col>
          <el-col :span="4" class="add"></el-col>
        </el-row>
      </div>
      <el-scrollbar class="list">
        <ul class="sys-menu">
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="item.active ? 'active' : ''"
          >
            <router-link
              v-bind:to="item.url"
              class="block"
              @click="handleClick(item)"
            >
              {{ item.text }}
            </router-link>
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <div class="right">
      <Top></Top>
      <router-view v-slot="{ Component }" class="main-view">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Top from "@/components/Top.vue";
import { ref } from "vue";
const list = ref([
  { text: "个人信息", url: "/index/system/user", active: true },
  { text: "修改密码", url: "/index/system/pwd", active: false },
]);

const handleClick = (item: any) => {
  list.value.forEach((item) => {
    item.active = false;
  });
  item.active = true;
};
</script>
router.push("/index/system/user");
<style scoped lang="scss">
.sys-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    line-height: 30px;
    padding: 10px;
  }
  .active {
    background: #f8f8f8;
  }
}
.block {
  display: block;
}
</style>
