import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

Vue.config.productionTip = false;

Window.Pusher = require("pusher-js");

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "anyKey",
  id: "anyID",
  secret: "anySecret",
  cluster: "mt1",
  wsHost: "localhost",
  wsPort: 6001,
  disableStats: true,
  authEndpoint: "http://localhost:8000/api/broadcasting/auth",
  enabledTransports: ["ws", "flash"],
  forceTLS: false,
  encrypted: false,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "X-CSRF-Token": "CSRF_TOKEN",
      //  Accept: 'application/json'
    },
  },
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
