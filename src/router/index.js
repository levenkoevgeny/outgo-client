import { createRouter, createWebHistory } from "vue-router"

import {
  NotFoundView,
  NetworkErrorView,
  ServerErrorView,
} from "@/components/errors"
import {
  ClientMainView,
  NewOutgoView,
  OutgoUpdateView,
} from "@/components/client"
import { AdminMainView, UsersView, SubdivisionsView } from "@/components/admin"
import { LoginView } from "@/components/auth"
import store from "@/store"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  { path: "", name: "root", redirect: "/client" },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/admin",
    name: "admin-main",
    component: AdminMainView,
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: "/admin/users",
    name: "admin-users",
    component: UsersView,
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: "/admin/subdivisions",
    name: "admin-subdivisions",
    component: SubdivisionsView,
    meta: { requiresAuth: true, requiresStaff: true },
  },
  {
    path: "/client",
    name: "client-main",
    component: ClientMainView,
    meta: { requiresAuth: true },
  },
  {
    path: "/network-error",
    name: "network-error",
    component: NetworkErrorView,
    meta: { requiresAuth: false },
  },
  {
    path: "/server-error",
    name: "server-error",
    component: ServerErrorView,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }

  const user = store.getters["auth/getUser"]
  if (user) {
    const isStaff = user.is_staff
    if (to.meta.requiresStaff && !isStaff) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      }
    }
  }
})

export default router
