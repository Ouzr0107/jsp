<template lang="">
  <n-config-provider :theme="theme">
    <n-space vertical size="large">
      <n-layout style="height: 100%" position="absolute">
        <n-layout-header style="height: 64px; padding: 1rem" bordered>
          <n-space justify="space-between">
            <n-gradient-text :size="24" type="success">
              <b>博客系统</b>
            </n-gradient-text>
            <n-space>
              <n-select
                v-model:value="searchType"
                :options="options"
                placeholder="类型"
                style="margin-left: 2rem; width: 5rem"
              />
              <n-input
                style="width: 10rem"
                v-model:value="searchText"
                type="text"
                placeholder="搜索"
                @change="searchBlogs"
              />
              <n-button
                style="margin-top: -0.1rem"
                text
                @click="searchBlogs"
                type="primary"
              >
                <n-icon size="36">
                  <SearchCircle />
                </n-icon>
              </n-button>
            </n-space>

            <span style="float: right; margin-top: -0.2rem">
              <n-button
                text
                v-if="!theme"
                @click="
                  theme = darkTheme;
                  store.saveTheme('dark');
                "
              >
                <n-icon size="36">
                  <Bulb />
                </n-icon>
              </n-button>
              <n-button
                text
                v-else
                @click="
                  theme = null;
                  store.saveTheme('light');
                "
              >
                <n-icon size="36">
                  <BulbOutline />
                </n-icon>
              </n-button>
              <n-button
                text
                @click="showPanel = true"
                type="primary"
                v-if="show"
              >
                <n-icon size="36">
                  <log-in />
                </n-icon>
              </n-button>
              <n-button text @click="logout" type="error" v-if="!show">
                <n-icon size="36">
                  <log-out />
                </n-icon>
              </n-button>
            </span>
          </n-space>

          <n-modal
            v-model:show="showPanel"
            title="账号"
            preset="card"
            :style="panel"
          >
            <n-tabs
              class="card-tabs"
              default-value="signin"
              size="large"
              animated
              style="margin: 0 -4px"
              pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
            >
              <n-tab-pane name="signin" tab="登录">
                <Login></Login>
              </n-tab-pane>
              <n-tab-pane name="signup" tab="注册">
                <Register></Register>
              </n-tab-pane>
            </n-tabs>
          </n-modal>
        </n-layout-header>

        <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
          <n-layout-sider
            collapse-mode="width"
            :collapsed-width="64"
            :width="300"
            show-trigger="bar"
            bordered
            :show-collapsed-content="true"
          >
            <div style="margin: 2rem auto auto auto; text-align: center">
              <n-upload
                action="https://api.orz0107.com/user/avatar"
                :headers="{
                  satoken: satoken,
                }"
                @finish="router.go(0)"
              >
                <n-button v-if="!show" text>
                  <n-popover trigger="hover" placement="right">
                    <template #trigger>
                      <n-avatar
                        :size="50"
                        :src="avatar"
                        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                      />
                    </template>
                    <span>点击上传头像</span>
                  </n-popover></n-button
                >
              </n-upload>
              <div v-if="!show">博客数目：{{ num }}</div>
            </div>
            <n-menu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
              accordion
            />
          </n-layout-sider>
          <n-layout-content
            content-style="padding: 24px;"
            :native-scrollbar="false"
          >
            <router-view :key="route.fullPath" />
          </n-layout-content>
        </n-layout>
        <n-layout-footer
          bordered
          position="absolute"
          style="height: 64px; padding: 24px"
        >
          Powered by Vue.js, Spring Boot, Naive UI. Made by WXM.
        </n-layout-footer>
      </n-layout>
    </n-space>
    <n-back-top :right="100" />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import {
  NIcon,
  useMessage,
  type MenuOption,
  useOsTheme,
  darkTheme,
  lightTheme,
} from "naive-ui";
import { useUserStore } from "@/stores";
import router from "@/router";
import {
  LogIn,
  Documents,
  Bookmarks,
  LogOut,
  AddCircle,
  Person,
  LogoMarkdown,
  Bulb,
  BulbOutline,
  SearchCircle,
} from "@vicons/ionicons5";
import { ref, type Component, h, nextTick, onMounted } from "vue";
import axios from "axios";

const store = useUserStore();
const message = useMessage();
window.message = useMessage();
const showPanel = ref(false);
const show = ref(true);
const avatar = ref("");
const username = ref("");
const osThemeRef = useOsTheme();
const theme = ref();
const isRefreshed = ref(true);
const searchText = ref("");
const searchType = ref("title");
const Category = ref<MenuOption[]>([]);
const route = useRoute();
const num = ref(0);

const satoken = localStorage.getItem("satoken");
const themeToken = localStorage.getItem("themeToken");

const options = [
  {
    label: "标题",
    value: "title",
  },
  {
    label: "介绍",
    value: "description",
  },
  {
    label: "作者",
    value: "username",
  },
];

interface blog {
  blogId: string;
  title: string;
  description: string;
  category: string;
  content: string;
  type: string;
}

if (satoken) {
  show.value = false;
  axios.get("/user").then((res) => {
    username.value = res.data.data.username;
    avatar.value = "https://api.orz0107.com/user/avatar?id=" + res.data.data.id;
  });
  axios.get("/blog/num").then((res) => {
    num.value = res.data.data;
  });
}

if (themeToken) {
  theme.value = themeToken === "dark" ? darkTheme : lightTheme;
} else {
  theme.value = osThemeRef.value === "dark" ? darkTheme : lightTheme;
  store.saveTheme(osThemeRef.value!);
}

const panel = ref({
  width: "30rem",
});

function refresh() {
  isRefreshed.value = false;
  nextTick(() => {
    isRefreshed.value = true;
  });
}

onMounted(() => {
  getCategory();
});

function getCategory() {
  axios.get("/blog/category").then((res) => {
    const list: Array<blog> = res.data.data;
    for (const it of list) {
      Category.value.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: "Category",
                query: { category: it.category },
              },
              onclick: refresh,
            },
            { default: () => it.category }
          ),
        key: it.category,
      });
    }
  });
}

function logout() {
  store.removeInfo();
  message.success("退出成功");
  router.go(0);
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Blogs",
          },
        },
        { default: () => "首页" }
      ),
    key: "Blogs",
    icon: renderIcon(Documents),
  },
  {
    label: "分类",
    key: "Category",
    icon: renderIcon(Bookmarks),
    children: Category.value!,
  },
  {
    label: !show.value
      ? () =>
          h(
            RouterLink,
            {
              to: {
                name: "Edit",
              },
            },
            { default: () => "发布文章" }
          )
      : "发布文章",
    key: "Edit",
    disabled: show.value,
    icon: renderIcon(AddCircle),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Me",
          },
        },
        { default: () => "关于作者" }
      ),
    key: "AboutMe",
    icon: renderIcon(Person),
  },
];

function searchBlogs() {
  router.push({
    name: "Blogs",
    query: {
      keyType: searchType.value,
      keyWords: searchText.value,
    },
  });
}
</script>

<style lang="scss">
.body {
  margin: auto;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
}

a {
  text-decoration: none;
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
