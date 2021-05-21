import store from '../store'
import Router from 'vue-router'
import moment from 'moment'

/**
 * Create a router instance.
 *
 * @param  {Array} routes
 * @return {Router}
 */
export default function router (routes) {
  const router = new Router({
    routes,
    scrollBehavior,
    mode: 'history'
  })

  router.beforeEach((to, from, next) => {
    const components = router.getMatchedComponents({ ...to })

    if (components.length) {
      setTimeout(() => {
        if (components[0].loading !== false) {
          router.app.$loading.start()
        }

        router.app.setLayout(components[0].layout || '')
      }, 0)
    }
    if (!store.getters.authCheck && store.getters.authToken) {
      store.dispatch('fetchAuthUser').then((res) => {
        moment.tz.setDefault(res.tz)
        next()
      }).catch(() => {
        next({ name: 'auth.login' })
      })
    } else {
      next()
    }
  })

  router.afterEach((to, from) => {
    setTimeout(function () {
      router.app.$loading.finish()
      if (!to.hash) {
        document.querySelector('.wrapper').scrollTop = 0
      }
    })
  })

  return router
}

/**
 * Add the "authenticated" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function authGuard (routes) {
  return guard(routes, (to, from, next) => {
    if (store.getters.authCheck) {
      next()
    } else {
      next({ name: 'auth.login' })
    }
  })
}

/**
 * Add the "guest" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function guestGuard (routes) {
  return guard(routes, (to, from, next) => {
    if (store.getters.authCheck) {
      next({ name: 'auth.login' })
    } else {
      next()
    }
  })
}

/**
 * Add the "admin" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function adminGuard (routes) {
  return guard(routes, (to, from, next) => {
    if (store.getters.authCheck && store.getters.isAdmin) {
      next()
    } else {
      next({ name: 'auth.login' })
    }
  })
}

/**
 * Add the "person" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function personGuard (routes) {
  return guard(routes, (to, from, next) => {
    if (store.getters.authCheck && store.getters.isPerson || store.getters.isAdmin) {
      next()
    } else {
      if (store.getters.authCheck) {
        next({ name: 'user.profile' })
      } else {
        next({ name: 'auth.login' })
      }
    }
  })
}

/**
 * Add the "user" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function userGuard (routes) {
  return guard(routes, (to, from, next) => {
    if (store.getters.authCheck && store.getters.isUser || store.getters.isAdmin) {
      next()
    } else {
      if (store.getters.authCheck) {
        next({ name: 'auth.become.user' })
      } else {
        next({ name: 'auth.login' })
      }
    }
  })
}

/**
 * @param  {Array} routes
 * @param  {Function} guard
 * @return {Array}
 */
function guard (routes, guard) {
  routes.forEach(route => {
    route.beforeEnter = guard
  })

  return routes
}

/**
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */
function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  const position = {}

  if (to.hash) {
    position.selector = to.hash
  }

  if (to.matched.some(m => m.meta.scrollToTop)) {
    position.x = 0
    position.y = 0
  }

  return position
}
