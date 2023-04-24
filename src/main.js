import { createApp } from 'vue'

import ElementPlus from 'element-plus'  //引入element-plus库
import 'element-plus/dist/index.css'  //引入element-plus样式

import App from './App.vue'
import './assets/main.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
//createApp(App).mount('#app')

const app = createApp(App)

app.use(ElementPlus)
app.use(VueAxios, axios)
//app.use(VForm3)  //全局注册VForm3(同时注册了v-form-designe、v-form-render等组件)
app.provide('$axios', axios)
app.mount('#app')