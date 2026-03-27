import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import SingInPage from './pages/SingInPage.vue'
import SingUpPage from './pages/SingUpPage.vue'
import Test from './pages/TestPage.vue'
import { useAuthStore } from './store/auth.store'

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  TEST: '/test',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGN_UP, component: SingUpPage },
  { path: ROUTES.SIGN_IN, component: SingInPage },
  {
    path: '/decks/new',
    component: () => import('./pages/DeckFormPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id/edit',
    component: () => import('./pages/DeckFormPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id',
    component: () => import('./pages/DeckDetailsPage.vue'),
    meta: { requiresAuth: true },
  },
  { path: ROUTES.TEST, component: Test },
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
