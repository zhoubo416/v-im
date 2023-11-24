import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/index",
    name: "Home",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "chat",
        name: "chatBox",
        component: () => import("../views/chat/Index.vue"),
      },
      {
        path: "friend",
        name: "friendBox",
        component: () => import("../views/friend/Index.vue"),
        children: [
          {
            path: ":id",
            name: "user",
            component: () => import("../views/friend/UserInfo.vue"),
          },
        ],
      },
      {
        path: "dept",
        name: "deptBox",
        component: () => import("../views/dept/Index.vue"),
        children: [
          {
            path: "new",
            name: "new",
            component: () => import("../views/dept/New.vue"),
          },
          {
            path: ":id",
            name: "dept",
            component: () => import("../views/dept/DeptInfo.vue"),
          },
        ],
      },
      {
        path: "group",
        name: "groupBox",
        component: () => import("../views/group/Index.vue"),
        children: [
          {
            path: "new",
            name: "new",
            component: () => import("../views/group/New.vue"),
          },
          {
            path: ":id",
            name: "group",
            component: () => import("../views/group/Info.vue"),
          },
        ],
      },
      {
        path: "system",
        name: "systemBox",
        component: () => import("../views/sys/Index.vue"),
        children: [
          {
            path: "user",
            name: "sys-user",
            component: () => import("../views/sys/user/index.vue"),
          },
          {
            path: "pwd",
            name: "pwd",
            component: () => import("../views/sys/pwd/index.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
];
// 这里必须是createWebHashHistory模式，也就是 hash 模式，否则打包完成是白板。
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
