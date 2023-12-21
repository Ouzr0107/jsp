<template lang="">
  <div class="body">
    <n-timeline size="large" :icon-size="20">
      <n-timeline-item
        v-for="blog in blogs"
        :type="blog.type"
        :time="blog.created"
      >
        <n-card hoverable>
          <template #header>
            <h4>
              <router-link
                :to="{ name: 'Detail', query: { blogId: blog.blogId } }"
              >
                {{ blog.title }}
              </router-link>
            </h4>
          </template>
          <template #header-extra>
            <n-avatar
              size="small"
              :src="'https://api.orz0107.com/user/avatar?id=' + blog.id"
              style="margin-right: 1rem"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />{{ blog.username }}
          </template>
          {{ blog.description }}
          <template #action>
            <router-link
              :to="{ name: 'Category', query: { category: blog.category } }"
            >
              #{{ blog.category }}
            </router-link>
          </template>
        </n-card>
      </n-timeline-item>
    </n-timeline>
    <n-pagination v-model:page="page" :page-count="pages" />
    <n-back-top :right="100" />
  </div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { CashOutline, Chatbubble } from "@vicons/ionicons5";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();

const blogs = ref({});
const page = ref(1);
const pages = ref(1);
const key = route.query.keyWords as string;
const type = route.query.keyType as string;

if (key) {
  getSearchPage();
} else {
  getPage();
}

function getSearchPage() {
  axios
    .post("/blog/search", {
      page: page.value,
      keyWords: key,
      type: type,
    })
    .then((res) => {
      const pageData = res.data.data;
      blogs.value = pageData.records;
      pages.value = pageData.pages;
    });
}

function getPage() {
  axios
    .post("/blog/list", {
      page: page.value,
    })
    .then((res) => {
      const pageData = res.data.data;
      blogs.value = pageData.records;
      pages.value = pageData.pages;
    });
}

watch(page, () => {
  if (key) {
    getSearchPage();
  } else {
    getPage();
  }
});
</script>
<style lang=""></style>
