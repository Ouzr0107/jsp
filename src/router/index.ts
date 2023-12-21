import { idID } from "naive-ui";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Blogs",
      component: () => import("../views/Blogs.vue"),
      meta: {
        index: 0,
      },
    },
    {
      path: "/blog",
      name: "Detail",
      component: () => import("../views/BlogDetail.vue"),
    },
    {
      path: "/edit",
      name: "Edit",
      component: () => import("../views/BlogEdit.vue"),
    },
    {
      path: "/about",
      name: "Me",
      component: () => import("../views/AboutMe.vue"),
    },
    {
      path: "/category",
      name: "Category",
      component: () => import("../views/Category.vue"),
    },
  ],
});

export default router;
