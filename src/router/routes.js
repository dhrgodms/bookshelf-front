const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: false } },
      {
        path: 'join',
        component: () => import('pages/JoinPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/book',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/BookSearchPage.vue'),
      },
      { path: 'search', component: () => import('pages/BookSearchPage.vue') },
    ],
  },
  {
    path: '/member',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/MemberHome.vue') }, // [ ] TODO member 페이지
      { path: 'shelf', component: () => import('pages/MemberShelfPage.vue') },
    ],
  },
  // {
  //   path: '/skeleton',
  //   component: () => import('layouts/MainLayout.vue'),
  //   meta: { requiresAuth: true },
  //   children: [
  //     { path: '', component: () => import('pages/MemberHome.vue') }, // [ ] TODO member 페이지
  //     { path: 'result', component: () => import('pages/SkeletonResultPage.vue') },
  //   ],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
