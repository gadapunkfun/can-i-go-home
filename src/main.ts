import { Quasar, type QuasarPluginOptions } from "quasar";
import { createApp } from "vue";
import { createPinia } from "pinia";

import quasarLang from "quasar/lang/sv";
import quasarIconSet from "quasar/icon-set/svg-mdi-v6";

import "@quasar/extras/mdi-v6/mdi-v6.css";
import "quasar/src/css/index.sass";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Quasar, {
	plugins: {},
	lang: quasarLang,
	iconSet: quasarIconSet
} as QuasarPluginOptions);
app.use(createPinia());
app.use(router);

app.mount("#app");

