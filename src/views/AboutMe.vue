<template lang="">
  <div class="body">
    <h1>关于作者</h1>
    <n-divider />
    <div class="markdown-body" v-html="content"></div>
  </div>
  <div style="text-align: center" v-if="showButton">
    <n-button
      type="info"
      strong
      secondary
      @click="getBlogView"
      style="margin-bottom: 1rem"
      >显示博客列表</n-button
    >
    <n-data-table
      :columns="columns"
      :data="data"
      style="width: 50%; margin: auto"
    />
    <br />
    <n-button
      type="error"
      strong
      secondary
      @click="delAllBlogs"
      style="margin-top: 1rem"
      >删除自己所有文章</n-button
    >
  </div>
  <n-back-top :right="100" />
</template>
<script lang="ts" setup>
import axios from "axios";
import { Tokenizer, marked } from "marked";
import { ref } from "vue";
import "github-markdown-css";
import router from "@/router";

const content = ref("");
const satoken = localStorage.getItem("satoken");

const createColumns = () => {
  return [
    {
      title: "标题",
      key: "title",
    },
    {
      title: "描述",
      key: "description",
    },
    {
      title: "分类",
      key: "category",
    },
    {
      title: "类别",
      key: "type",
    },
  ];
};

const data = ref([]);
const columns = createColumns();
const showButton = ref(false);

if (satoken) {
  showButton.value = true;
}

function getMe() {
  axios.get("/user/me").then((res) => {
    content.value = marked(res.data.data);
  });
}

function delAllBlogs() {
  axios.delete("/blog/all").then((res) => {
    router.push("/");
  });
}

function getBlogView() {
  axios.get("/blog/view").then((res) => {
    data.value = res.data.data;
  });
}

getMe();
</script>
<style lang=""></style>
