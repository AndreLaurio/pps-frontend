import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

//User
import User from '../views/user/UserIndex'

//Admin
import Admin  from '../views/admin/AdminIndex'
import AdminCreateUser from '../views/admin/AdminCreateUser'
import AdminAccountApproval from '../views/admin/AdminAccountApproval'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/admin/create-user',
    name: 'AdminCreateUser',
    component: AdminCreateUser
  },
  {
    path: '/admin/account-approval',
    name: 'AdminAccountApproval',
    component: AdminAccountApproval
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
