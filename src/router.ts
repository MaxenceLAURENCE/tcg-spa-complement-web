import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import SingInPage from './pages/SingInPage.vue'
import SingUpPage from './pages/SingUpPage.vue'
import { useAuthStore } from './store/auth.store'

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage },
  { path: ROUTES.SIGN_UP, component: SingUpPage },
  { path: ROUTES.SIGN_IN, component: SingInPage },
  // Exemple de page avec connexion :
  // {
  //   path: ROUTES.CONTENT,
  //   component: ContentPage,
  //   meta: { requiresAuth: true },
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // si demande connexion et pas connecté -> redirige vers connexion
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.SIGN_IN
  }

  // refuse l'accès à la page de connexion / inscription si l'utilisateur est déjà connecté -> redirige vers home
  if (
    (to.path === ROUTES.SIGN_IN || to.path === ROUTES.SIGN_UP) &&
    auth.isAuthenticated
  ) {
    return ROUTES.HOME
  }

  return true
})

export default router
