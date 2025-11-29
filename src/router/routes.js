const routes = [
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
   {
    path: '/',
    component: () => import('src/pages/auth/LoginForm.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
