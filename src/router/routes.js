const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('src/pages/default/IndexPage.vue') },
      // { path: 'shelf/:id', name: 'shelf-detail', component: () => import('pages/ShelfDetail.vue') },
      { path: 'search', name: 'search', component: () => import('pages/BookSearchPage.vue') },
      // { path: 'explore', name: 'explore', component: () => import('pages/ExploreShelves.vue') },
      {
        path: 'join',
        component: () => import('src/pages/default/JoinPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'login',
        component: () => import('src/pages/default/LoginPage.vue'),
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
    path: '/search',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/BookSearchPage.vue') }],
  },
  {
    path: '/member',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/MemberHome.vue') }, // [ ] TODO member 페이지
      { path: 'shelf', component: () => import('src/pages/MemberShelfPage.vue') },
      { path: 'book', component: () => import('src/pages/MemberBookPage.vue') },
    ],
  },
  {
    path: '/shelf',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'add', component: () => import('src/pages/shelf/ShelfCreatePage.vue') },
      { path: ':id', component: () => import('src/pages/shelf/ShelfDetailPage.vue') },
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
    component: () => import('src/pages/default/ErrorNotFound.vue'),
  },
]

export default routes
