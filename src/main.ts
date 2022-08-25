import Vue from "vue";

import "normalize.css";
import ElementUI from "element-ui";
import SvgIcon from "vue-svgicon";
import locale from "@/lang/en";

import "@/styles/element-variables.scss";
import "@/styles/index.scss";

import App from "@/App.vue";

import store from "@/_core/store";
import router from "@/_core/router";
import "@/_sharedKernel/icons/components";
import "@/permission";

Vue.use(ElementUI, { locale });

Vue.use(SvgIcon, {
    tagName: "svg-icon",
    defaultWidth: "1.4em",
    defaultHeight: "1.4em",
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
