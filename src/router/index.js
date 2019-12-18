import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Main from '../components/Main'
import Check from '../components/Check'
import Register from "../components/Register"
import Input from '../components/Input'
import FaceAdd from '../components/FaceAdd'
import Error from "../components/Error"
import Student from "../components/Student"
import Record from "../components/Record"
import ManageClass from "../components/ManageClass"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/reg',
      name: 'Register',
      component: Register
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/record',
          name: 'record',
          component: Record
        },
        {
          path: '/student',
          name: 'student',
          component: Student
        },{
          path: '/manage_class',
          name: 'manage_class',
          component: ManageClass
        }]
    },
    {
      path: '/face/check/:id',
      name: 'Check',
      component: Check
    },
    {
      path: '/face/add',
      name: 'FaceAdd',
      component: FaceAdd
    },
    {
      path: '/input/:id',
      name: 'Input',
      component: Input
    },
    {
      path: '*',
      name: 'Error',
      component: Error
    }
  ]
})
