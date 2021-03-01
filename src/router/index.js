import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/Index'
import Login from '../components/Login'

import Overview from '../components/overview/Overview'

import Detail from '../components/detail/Detail'

import Problem from '../components/problem/Problem'

import Users from '../components/users/Users'

import store from '../store/index'
import axios from 'axios'
Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: Overview
      },
      {
        path: 'detail',
        name: 'detail',
        component: Detail,
      },
      {
        path: 'problem',
        name: 'problem',
        component: Problem,
      },
      {
        path: 'users',
        name: 'users',
        component: Users
      },
      {
        path: '',
        redirect: '/index/overview'
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    redirect: '/index'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location){
  return originalPush.call(this, location).catch(err => err);
}

router.beforeEach(( to, from, next ) => {
  console.log(to);
  if (to.name != 'login'){
    if (store.state.user){
      next();
    } else {
      axios.get('/api/admin/islogin').then( ret => {
        if (ret.data.msg === "pass"){
          store.state.user = ret.data.user;
          next();
        } else {
          next('/login');
        }
      }).catch( err => {
        console.log(err);
        next('/login');
      })
    }
  } else {
    if (store.state.user){
      router.push('/index/overview');
    } else {
      next();
    }
  }
})

export default router
