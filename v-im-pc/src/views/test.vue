<template>
  <div>
    <div ref="contextmenu" @contextmenu="showContextMenu">右键单击这里</div>
    <context-menu
      :items="items"
      :trigger="trigger"
      :placement="placement"
      ref="menu"
    ></context-menu>
  </div>
</template>

<script>
import ContextMenu from "@/components/ContextMenu.vue";
import { ref } from "vue";

export default {
  components: {
    ContextMenu,
  },
  setup() {
    const items = ref([
      {
        name: "打开",
        action: () => {
          console.log("打开");
        },
      },
      {
        name: "保存",
        action: () => {
          console.log("保存");
        },
      },
    ]);

    const trigger = ref("右键单击");
    const placement = ref("bottom-end");

    const showContextMenu = (event) => {
      event.preventDefault();
      const menu = this.$refs.menu;
      if (menu) {
        menu.showMenu(event);
      }
    };

    return {
      items,
      trigger,
      placement,
      showContextMenu,
    };
  },
};
</script>
