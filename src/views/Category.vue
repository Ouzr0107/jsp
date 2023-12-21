<template lang="">
  <div class="body">
    <h1>{{ category }}</h1>
    <n-list hoverable clickable>
      <n-list-item v-for="blog in blogs">
        <router-link :to="{ name: 'Detail', query: { blogId: blog.blogId } }">
          <n-thing :title="blog.title" content-style="margin-top: 10px;">
            <template #header-extra>
              <n-avatar
                size="small"
                :src="'https://api.orz0107.com/user/avatar?id=' + blog.id"
                style="margin-right: 1rem"
                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
              />{{ blog.username }}
            </template>
            <template #description>
              <n-space size="small" style="margin-top: 4px">
                <n-tag :bordered="false" :type="blog.type" size="small">{{
                  type_dic[blog.type]
                }}</n-tag>
              </n-space>
            </template>
            {{ blog.description }}
          </n-thing>
        </router-link>
      </n-list-item>
    </n-list>
  </div>
  <n-back-top :right="100" />
</template>
<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const blogs = ref({});
const category = route.query.category;

const type_dic = {
  default: "默认",
  info: "信息",
  success: "成功",
  warning: "警告",
  error: "错误",
};

function getBlogs() {
  axios
    .post("/blog/category", {
      category: category,
    })
    .then((res) => {
      blogs.value = res.data.data;
      console.log(blogs);
    });
}

getBlogs();
</script>
<style lang=""></style>
