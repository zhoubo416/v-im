<template>
  <div class="im-top" style="-webkit-app-region: drag">
    <a
      href="javascript:void(0)"
      @click="min()"
      style="-webkit-app-region: no-drag"
    >
      <i class="iconfont icon-v-24gl-minimization"></i>
    </a>
    <a
      href="javascript:void(0)"
      @click="max()"
      style="-webkit-app-region: no-drag"
    >
      <i class="iconfont" :class="icon"></i>
    </a>
    <a
      href="javascript:void(0)"
      @click="close()"
      style="-webkit-app-region: no-drag"
    >
      <i class="iconfont icon-v-guanbi1"></i>
    </a>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
function min() {
  proxy.$winControl.default.min();
}
const iconBig = "icon-v-yk_fangkuai";
const iconSmall = "icon-v-xiaoxitixingchuangkoudanchufangshi";
const icon = ref(iconSmall);

function max() {
  proxy.$winControl.default.max();
  icon.value =
    icon.value === iconBig
      ? "icon-v-xiaoxitixingchuangkoudanchufangshi"
      : iconBig;
}

function close() {
  proxy.$winControl.default.close();
}
</script>
<style lang="scss" scoped>
$top-height: 3rem;
$color-online: #d1ffe9;

.im-top {
  height: $top-height;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 2;
  right: 0;
  width: 100%;

  a {
    display: inline-block;
    color: $color-write;
    text-decoration: none;
    padding: 10px;

    i {
      color: $color-default;
      font-size: 1.4rem;
      font-weight: bolder;
    }

    :hover {
      background-color: $color-gray;
    }

    .text-right {
      float: right;
      width: 2.4rem;
      height: 2.4rem;
      display: inline-block;
      padding: 0.5rem;
      text-align: center;
    }
  }
}
</style>
