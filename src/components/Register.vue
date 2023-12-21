<template lang="">
  <n-form ref="formRef" :model="model" :rules="rules">
    <n-form-item path="username" label="用户名">
      <n-input
        v-model:value="model.username"
        placeholder="字母开头，允许 5-16 字节，允许字母数字下划线"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input
        v-model:value="model.password"
        type="password"
        placeholder="以字母开头，长度在 6~18 之间，只能包含字母、数字和下划线"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="rpassword" label="重复密码">
      <n-input
        v-model:value="model.rpassword"
        type="password"
        :disabled="!model.password"
        placeholder="与上面密码相同"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-space justify="center">
      <n-button
        :disabled="model.username === null"
        type="primary"
        @click="register"
      >
        注册
      </n-button>
    </n-space>
  </n-form>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores/index";
import axios from "axios";
import {
  useMessage,
  type FormInst,
  type FormRules,
  type FormItemRule,
} from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

const message = useMessage();
const router = useRouter();
const store = useUserStore();

const formRef = ref<FormInst | null>(null);
const modelRef = ref({
  username: null,
  password: null,
  rpassword: null,
});
const model = modelRef.value;

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password;
}

const rules: FormRules = {
  username: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入用户名");
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(value)) {
          return new Error("用户名不合法");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入密码");
        } else if (!/^[a-zA-Z]\w{5,17}$/.test(value)) {
          return new Error("密码不合法");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
  rpassword: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: ["input", "blur"],
    },
    {
      validator: validatePasswordSame,
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"],
    },
  ],
};

function login(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      axios
        .post("/user/login", model)
        .then((res) => {
          const satoken = res.data.data;
          if (satoken) {
            message.success("登陆成功");
            store.setToken(satoken);
          }
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

function register(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      axios
        .post("/user/register", model)
        .then((res) => {
          const satoken = res.data.data;
          if (satoken) {
            message.success("注册成功");
            store.setToken(satoken.tokenValue);
          }
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
</script>
<style lang="scss"></style>
