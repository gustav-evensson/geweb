import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app from '../firebase/init'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import YourPostsView from '../views/YourPostsView.vue'
import FollowView from '../views/FollowView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/yourposts',
    name: 'yourposts',
    component: YourPostsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/follow',
    name: 'follow',
    component: FollowView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const auth = getAuth(app)

function getUser(){
  return new Promise((resolve, reject) => {
    const getAuth = onAuthStateChanged(auth, (user) => {
      getAuth()
      resolve(user)
    }, reject)
  })
}

router.beforeEach(async (to, from, next) => {
  let isAuth = await getUser()
  const reqAuth = to.matched.some(record => record.meta.requiresAuth)
  if(reqAuth && !isAuth){
    next('/login')
  }
  else(
    next()
  )
})

export default router
