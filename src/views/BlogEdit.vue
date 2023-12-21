<template lang="">
  <div class="body">
    <n-form ref="formRef" :model="modelRef" :rules="rules">
      <n-form-item path="title" label="标题">
        <n-input
          v-model:value="modelRef.title"
          @keydown.enter.prevent
          placeholder="要像 UC 新闻部那样炸眼"
        />
      </n-form-item>
      <n-form-item path="description" label="摘要">
        <n-input
          v-model:value="modelRef.description"
          type="textarea"
          @keydown.enter.prevent
          placeholder="这篇文章主要讲了啥"
        />
      </n-form-item>
      <n-form-item path="category" label="分类">
        <n-input
          v-model:value="modelRef.category"
          @keydown.enter.prevent
          placeholder="一个词语便可"
        />
      </n-form-item>
      <n-form-item path="type" label="类别">
        <n-select
          v-model:value="modelRef.type"
          :options="options"
          placeholder="啥色啊？"
        />
      </n-form-item>
      <n-form-item path="content" label="内容">
        <div class="mavonEditor">
          <mavon-editor
            ref="md"
            v-model="modelRef.content"
            @imgAdd="imgAdd"
            :boxShadow="false"
          />
        </div>
      </n-form-item>
      <n-space justify="end">
        <n-button tertiary type="error" v-if="ownBlog" @click="delBlog">
          删除
        </n-button>
        <n-button type="primary" @click="submitForm"> 提交 </n-button>
      </n-space>
    </n-form>
  </div>
  <n-back-top :right="100" />
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores";
import axios from "axios";
import {
  type FormInst,
  type FormRules,
  type FormItemRule,
  useMessage,
  useThemeVars,
} from "naive-ui";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const message = useMessage();
const router = useRouter();
const route = useRoute();
const blogId = route.query.blogId;
const satoken = localStorage.getItem("satoken");

const ownBlog = ref(false);
const formRef = ref<FormInst | null>(null);
const modelRef = ref({
  blogId: "",
  title: "",
  description: "",
  category: "",
  content: "",
  type: null,
});

const md = ref();

const options = [
  {
    label: "default",
    value: "default",
  },
  {
    label: "tertiary",
    value: "tertiary",
    style: {
      color: "#767c82",
    },
  },
  {
    label: "primary",
    value: "primary",
    style: {
      color: "#18a058",
    },
  },
  {
    label: "info",
    value: "info",
    style: {
      color: "#2080f0",
    },
  },
  {
    label: "success",
    value: "success",
    style: {
      color: "#18a058",
    },
  },
  {
    label: "warning",
    value: "warning",
    style: {
      color: "#f0a020",
    },
  },
  {
    label: "error",
    value: "error",
    style: {
      color: "#d03050",
    },
  },
];
if (satoken) {
  if (blogId) {
    axios
      .post("/blog/get", {
        blogId: blogId,
      })
      .then((res) => {
        const blog = res.data.data;
        if (satoken) {
          axios.get("/user").then((res) => {
            const user = res.data.data;
            if (blog.id === user.id) {
              ownBlog.value = true;
            } else {
              router.push("/");
            }
          });
        }
        modelRef.value = blog;
      });
  }
} else {
  router.push("/");
}

const rules: FormRules = {
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: ["input", "blur"],
    },
  ],
  description: [
    {
      required: true,
      message: "请输入摘要",
      trigger: ["input", "blur"],
    },
  ],
  category: [
    {
      required: true,
      message: "请输入分类",
      trigger: ["input", "blur"],
    },
  ],
  type: [
    {
      required: true,
      message: "请选择类别",
      trigger: ["input", "blur"],
    },
  ],
  content: [
    {
      required: true,
      message: "写点什么吧",
      trigger: ["input", "blur"],
    },
  ],
};

function submitForm(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      axios
        .post("/blog", modelRef.value)
        .then((res) => {
          const code = res.data.code;
          if (code === 200) {
            message.success("提交成功");
          }
          router.push("/");
          router.go(0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(errors);
    }
  });
}

function delBlog() {
  axios.delete("/blog", { data: modelRef.value }).then((res) => {
    router.push("/");
  });
}

function imgAdd(pos: number, file: File) {
  var formdata = new FormData();
  formdata.append("file", file);
  axios
    .post("/blog/pic", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      md.value.$img2Url(pos, res.data.data);
    });
}
</script>
<style lang="scss" scoped>
.markdown-body {
  max-height: 50rem;
}

.mavonEditor {
  margin: auto;
  width: auto;
  height: auto;
  border: 1px solid rgb(224, 224, 230);
  border-radius: 3px;
}
</style>
