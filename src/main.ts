import 'vue3-toastify/dist/index.css';
import "./style.css"
import { createApp } from 'vue'
import App from './App.vue'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';


import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(Vue3Toasity, 
  {
    autoClose: 3000,
    // ...
  } as ToastContainerOptions,
)
app
  .mount('#app')
  .$nextTick(() => {
    window.electron.hideLoading();
  })
