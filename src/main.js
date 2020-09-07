import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'

import 'video.js/dist/video-js.css'
import './components/video-player/custom-theme.css'

//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
