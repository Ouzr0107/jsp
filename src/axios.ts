import axios from "axios";
import { useUserStore } from "@/stores/index";
import router from "./router";

axios.defaults.baseURL = "https://api.orz0107.com";

axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const satoken = localStorage.getItem("satoken");
    if (satoken) {
      config.headers.satoken = satoken;
    }
    console.log("前置拦截");
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const res = response.data;
    if (res.msg) {
      if (res.code === 200) {
        return response;
      } else {
        window.message.error(res.msg);
        return Promise.reject(res.msg);
      }
    } else {
      return response;
    }
  },
  function (error) {
    const store = useUserStore();
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response.data) {
      error.message = error.response.data.msg;
    }
    const err = error.response;
    if (err.status === 401) {
      store.removeInfo;
      router.push({
        path: "/",
      });
      error.message = "请重新登录";
    }
    if (err.status === 403) {
      error.massage = "权限不足，无法访问";
    }
    window.message.error(error.message);
    return Promise.reject(error);
  }
);
