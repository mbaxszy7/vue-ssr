import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

// eslint-disable-next-line import/prefer-default-export
export const createRouter = () => {
  return new VueRouter({
    mode: "history",
    routes: [
      {
        path: "/",
        name: "home",
        component: () => import("@/pages/Home.vue"),
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@/pages/About.vue"),
      },
      {
        path: "/posts",
        name: "posts",
        component: () => import("@/pages/posts.vue"),
      },
      {
        path: "*",
        name: "error404",
        component: () => import("@/pages/404.vue"),
      },
    ],
  })
}
