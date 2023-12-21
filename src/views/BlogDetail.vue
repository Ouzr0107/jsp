<template lang="">
  <div class="body">
    <h2>
      {{ blog.title }}
      <router-link
        v-if="ownBlog"
        :to="{ name: 'Edit', query: { blogId: blog.blogId } }"
        ><n-button text
          ><n-icon size="36"> <create /> </n-icon
        ></n-button>
      </router-link>
      <br />
      <div style="text-align: right; font-size: 14px">
        <span style="margin-right: 1rem">{{ blog.updated }}</span
        >{{ blog.username
        }}<n-avatar
          size="small"
          :src="'https://api.orz0107.com/user/avatar?id=' + blog.id"
          style="margin-left: 1rem"
          fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />
      </div>
    </h2>
    <n-divider />
    <div class="markdown-body" v-html="blog.content"></div>
    <n-divider />
    <h3>评论区</h3>
    <div style="width: 80%; margin: auto">
      <n-input
        v-model:value="myComment.content"
        type="textarea"
        placeholder="没有屏蔽词"
      />
      <div style="margin-top: 1rem; text-align: right">
        <n-popover trigger="manual" placement="bottom" :show="showPopover">
          <template #trigger>
            <n-button type="success" @click="submit">评论</n-button>
          </template>
          <span v-if="situation">登陆后才能评论</span>
          <span v-if="!situation">评论内容不能为空</span>
        </n-popover>
      </div>
      <br />
      <n-card
        v-for="comment in blog.comments"
        embedded
        style="margin-top: 1rem"
      >
        <n-avatar
          size="small"
          :src="'https://api.orz0107.com/user/avatar?id=' + comment.userId"
          style="margin-right: 1rem"
          fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />{{ comment.username }}
        <template #footer>{{ comment.content }}</template>
        <template #action>{{ comment.created }}</template>
      </n-card>
    </div>
  </div>
  <n-back-top :right="100" />
</template>
<script lang="ts" setup>
import axios from "axios";
import { marked } from "marked";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Create } from "@vicons/ionicons5";
import "github-markdown-css";

const route = useRoute();
const router = useRouter();
const satoken = localStorage.getItem("satoken");
const ownBlog = ref(false);

const blog = ref();

const myComment = ref({
  userId: 0,
  docId: 0,
  content: "",
});
const showPopover = ref(false);
const situation = ref(true);
const user = ref({ id: 0 });

function getBlog() {
  const blogId = route.query.blogId;
  axios
    .post("/blog/get", {
      blogId: blogId,
    })
    .then((res) => {
      blog.value = res.data.data;
      blog.value.content = marked(blog.value.content);
      if (satoken) {
        axios.get("/user").then((res) => {
          user.value = res.data.data;
          ownBlog.value = blog.value.id === user.value.id;
        });
      }
    });
}

function submit() {
  if (!satoken) {
    situation.value = true;
    showPopover.value = true;
    return;
  }
  if (myComment.value.content.length === 0) {
    showPopover.value = true;
    situation.value = false;
    return;
  }
  showPopover.value = false;
  myComment.value.userId = user.value.id;
  myComment.value.docId = blog.value.blogId;
  axios.post("/blog/comment", myComment.value).then((res) => {
    router.go(0);
  });
}

getBlog();
</script>
<style lang=""></style>
