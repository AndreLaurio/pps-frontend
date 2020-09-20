import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

//User
import User from '../views/user/UserIndex'
import UserExamination from '../views/user/UserExamination'
import UserProfile from '../views/user/UserProfile'
import UserTakeExam from '../views/user/UserTakeExam'

//Admin
import Admin  from '../views/admin/AdminIndex'
import AdminCreateUser from '../views/admin/AdminCreateUser'
import AdminAccountApproval from '../views/admin/AdminAccountApproval'
import AdminExamination from '../views/admin/AdminExamination'
import AdminExaminees from '../views/admin/AdminExaminees'
import AdminCreateExamination from '../views/admin/AdminCreateExamination'
import AdminManageExaminees from '../views/admin/AdminManageExaminees'
import AdminViewResults from '../views/admin/AdminViewResults'
import AdminEditExam from '../views/admin/AdminEditExam'

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
    path: '/user/examination',
    name: 'UserExamination',
    component: UserExamination
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/user/exam/take',
    name: 'UserTakeExam',
    component: UserTakeExam
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
  },
  {
    path: '/admin/examinees',
    name: 'AdminExaminees',
    component: AdminExaminees
  },
  {
    path: '/admin/examination',
    name: 'AdminExamination',
    component: AdminExamination,
    props: true
  },
  {
    path: '/admin/create-examination',
    name: 'AdminCreateExamination',
    component: AdminCreateExamination
  },
  {
    path: '/admin/examination/examinees',
    name: 'AdminManageExaminees',
    component: AdminManageExaminees,
    props: true
  },
  {
    path: '/admin/examination/examinees',
    name: 'AdminViewResults',
    component: AdminViewResults,
    props: true
  },
  {
    path: '/admin/examination/edit',
    name: 'AdminEditExam',
    component: AdminEditExam,
    props: true
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
