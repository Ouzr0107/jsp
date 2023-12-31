import { createApp } from "vue";
import { createPinia } from "pinia";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";


import App from "./App.vue";
import router from "./router";
import "./axios";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(mavonEditor);

app.mount("#app");
