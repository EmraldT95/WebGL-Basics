import type { RouteRecordRaw } from 'vue-router'

const routes = new Array<RouteRecordRaw>(
  {
    path: '/',
    meta: {
      title: 'Triangle',
    },
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Triangle.vue'),
  },
  {
    path: '/rectangles',
    meta: {
      title: 'Rectangles',
    },
    component: () => import('../views/Rectangles.vue'),
  },
)

export default routes
