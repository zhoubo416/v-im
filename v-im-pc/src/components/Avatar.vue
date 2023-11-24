<template>
  <el-avatar
    v-if="url"
    shape="square"
    :size="size"
    :src="url"
    fit="cover"
  ></el-avatar>
  <el-avatar v-if="!url" shape="square" :size="size" fit="cover">
    <template #default>
      <span style="font-size: 2rem">{{ start }}</span>
    </template>
  </el-avatar>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import FetchRequest from "@/api/FetchRequest";

const host = ref(FetchRequest.getHost());
let props = defineProps({
  size: {
    type: String,
    required: false,
    default: "default",
  },
  img: {
    type: String,
    required: true,
    default: "@/assets/icon.png",
  },
  name: {
    type: String,
    required: false,
    default: "",
  },
});
let url = computed(() => {
  if (props.img?.indexOf("http") > -1) {
    return props.img;
  } else if (props.img?.trim() === "") {
    return null;
  } else {
    return host.value + props.img;
  }
});
let start = computed(() => {
  return props.name ? props.name[0] : "";
});
</script>
<style lang="scss" scoped>
.avatar {
  width: 6rem;
  height: 6rem;
}
</style>
