import Vue from 'vue'
import App from './App.vue'
import './assets/css/main.css'
//引入ElementUI组件库
import ElementUI from 'element-ui'
//引入ElementUI全部样式
import 'element-ui/lib/theme-chalk/index.css';
//引入vue-router
import VueRouter from "vue-router";
//引入路由器文件
import router from './router/index'
//引入Vuex插件
import store from './store/index'
//引入v-echarts图标库
import VCharts from 'v-charts'
import axios from "axios";
Vue.config.productionTip = false
Vue.config.silent = true
//应用ElementUI
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VCharts)
Vue.use(axios)
//axios接口配置
axios.defaults.baseURL = 'http://43.143.117.57:8090';



new Vue({
  render: h => h(App),
  router:router,
  store:store,
  //配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')


