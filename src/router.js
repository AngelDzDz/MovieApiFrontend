import {createRouter, createWebHistory} from 'vue-router';
import Login from './components/views/VueLogin.vue';
import Register from './components/views/VueRegister.vue'
import MyMovies from './components/views/MyMovies.vue';
import NotFound from './components/views/NotFound.vue';
import NonWatchedMovies from './components/views/NonWatchedMovies.vue';
import AddMovie from './components/views/AddMovie.vue';

const routes = [
    {
        path:'/',
        name:'Home',
        component:Login,
        //meta:{requiresAuth:true}
    },
    {
        path:'/login',
        name:'Login',
        component:Login,
        //meta:{requiresAuth:true}
    },
    {
        path:'/register',
        name:'Register',
        component: Register,
    },
    {
        path:'/my-movies',
        name:'MyMovies',
        component:MyMovies,
        children:[
            {
                path:'add',
                name:'AddMovie',
                component: AddMovie
            }

        ],
        meta:{requiresAuth:true}
    },
    {
        path:'/to-watch-movies',
        name:'NonWatchedMovies',
        component:NonWatchedMovies,
        meta:{requiresAuth:true}
    },
    {
        path:'/:pathMatch(.*)*',
        name:'NotFound',
        component:NotFound
    }
];

const router = createRouter(
    {
        history: createWebHistory(),
        routes
    }
);

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
    } else {
      next();
    }
});

export default router;