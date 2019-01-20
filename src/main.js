import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../public/css/reset.css'
import { Button, Toast, Loading } from 'vant'
//引入我们自己在 Loadding 插件
import LoaddingPlugin from "./plugins/loading"


import api from './api'
Vue.prototype.$api = api; //将所有接口挂载的vue实例原型上。

Vue.use(Button);
Vue.use(Toast);
Vue.use(Loading);
//通过Vue.use()使用我们的插件
Vue.use(LoaddingPlugin);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

