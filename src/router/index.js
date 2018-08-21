import Vue from 'vue'
import Router from 'vue-router'

import pageSudoker from '../components/page/pageSudoker'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: pageSudoker
    }
  ]
})

export default router
