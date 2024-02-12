window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from './router';
import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash,faPen,faCirclePlus,faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue'

library.add(faTrash);
library.add(faPen);
library.add(faCirclePlus);
library.add(faEye);

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
