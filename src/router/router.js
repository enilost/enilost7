import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import DetailRecord from '../views/DetailRecord.vue'

// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/compat/app'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'MainLayout', auth: true }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: { layout: 'LogRegLayout' }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "about" */ '../views/Categories.vue'),
    meta: { layout: 'MainLayout', auth: true }
  },
  {
    path: `/detailrecord/:idx`,
    name: 'DetailRecord',
    component: () => import(/* webpackChunkName: "about" */ '@/views/DetailRecord.vue'),

    meta: { layout: 'MainLayout', auth: true },
  },
  {
    path: '/history/',
    name: 'History',
    component: () => import(/* webpackChunkName: "about" */ '@/views/History.vue'),
    meta: { layout: 'MainLayout', auth: true }
  },
  {
    path: '/planning',
    name: 'Planning',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Planning.vue'),
    meta: { layout: 'MainLayout', auth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Profile.vue'),
    meta: { layout: 'MainLayout', auth: true }
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Record.vue'),
    meta: { layout: 'MainLayout', auth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Register.vue'),
    meta: { layout: 'LogRegLayout' }
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;

  const requreAuth = to.meta.auth;

  if (requreAuth && !currentUser) {
    next("/login?message=login");
  } else {
    next();
  }

});

export default router
