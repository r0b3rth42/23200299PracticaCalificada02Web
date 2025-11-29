const routes = [
  // LOGIN
  {
    path: '/login',
    component: () => import('src/pages/auth/LoginForm.vue'),
  },

  // REDIRECCIÓN AUTOMÁTICA desde "/" → "/login"
  {
    path: '/',
    redirect: '/login'
  },

  // MAIN LAYOUT (solo al entrar a /home)
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/digimon',  
        component: () => import('src/pages/digimon/DigimonCards.vue'),
      }
    ],
  },

  // 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
]

export default routes
