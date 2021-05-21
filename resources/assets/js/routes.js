import { authGuard, guestGuard, adminGuard, personGuard, userGuard } from './util/router'

export default [
  {
    path: '/',
    name: 'home',
    component: require('./pages/home.vue')
  },
  {
    path: '/',
    name: 'landing',
    component: require('./pages/home.vue')
  },
  {
    path: '/verify/:code',
    name: 'auth.verify',
    component: require('./pages/auth/verify.vue')
  },
  {
    path: '/saved-persons',
    name: 'saved-persons',
    component: require('./pages/savedPersons/page.vue')
  },
  {
    path: '/person/preview',
    name: 'person.profile.preview',
    component: require('./pages/profile/person/register-preview.vue')
  },
  {
    path: '/public/person/', component: require('./pages/profile/public-page.vue'),
    children: [
      {
        path: '', redirect: { name: 'person.public.profile' }
      },
      {
        path: ':hash', name: 'person.public.profile',
        component: require('./pages/profile/person/preview.vue')
      }
    ]
  },
  {
    path: '/terms-of-services',
    component: require('./pages/terms-of-services.vue')
  },
  {
    path: '/faq',
    component: require('./pages/faq.vue')
  },
  {
    path: '/privacy-policy',
    component: require('./pages/privacy-policy.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: require('./pages/about.vue')
  },
  {
    path: '/post/:post_id',
    name: 'post.single',
    component: require('./pages/wall/single-post.vue')
  },

  ...userGuard([

    {
      path: '/home',
      name: 'user.home',
      redirect: '/profile/user'
    },
    {
      path: '/profile',
      component: require('./pages/profile/page.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'user.profile' }
        },
        {
          path: 'user',
          name: 'user.profile',
          component: require('./pages/profile/user/user.vue')
        }
      ]
    },
    {
      path: '/profile/user/settings',
      name: 'user.profile.settings',
      component: require('./pages/profile/user/settings.vue')
    },

    {
      path: '/auth/become-an-person',
      name: 'auth.become.person',
      component: require('./pages/auth/become-an-person.vue')
    },
    {
      path: '/person/:user_id',
      component: require('./pages/profile/public-page.vue'),
      children: [
        {
          path: '',
          component: require('./pages/profile/person/preview.vue')
        },
        {
          path: 'reviews',
          name: 'review',
          component: require('./pages/profile/person/reviews/review.vue')
        },
        {
          path: 'appointments',
          component: require('./pages/appointments/page.vue'),
          children: [
            {
              path: 'request',
              name: 'appointments.request',
              component: require('./pages/profile/person/appointments/_request.vue')
            },
            {
              path: ':appointment_id/payment',
              name: 'appointments.payment',
              component: require('./pages/profile/person/appointments/_payment.vue')
            }
          ]
        }
      ]
    }
  ]),

  ...personGuard([

    { path: '/home', name: 'person.home', redirect: '/profile/person' },
    {
      path: '/profile', component: require('./pages/profile/page.vue'), children: [
        { path: '', redirect: { name: 'person.profile' }},
        { path: 'person', name: 'person.profile', component: require('./pages/profile/person/private-preview.vue') },
        { path: 'reviews', name: 'person.review', component: require('./pages/profile/person/reviews/review.vue') },
        {
          path: 'stripe', component: require('./pages/profile/person/stripe/page.vue'), children: [
            {
              path: 'error',
              name: 'person.stripe.error',
              component: require('./pages/profile/person/stripe/_error.vue')
            },
            {
              path: 'success',
              name: 'person.stripe.success',
              component: require('./pages/profile/person/stripe/_success.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/profile/person/settings',
      name: 'person.profile.settings',
      component: require('./pages/profile/person/settings.vue')
    },
    {
      path: '/auth/become-an-user',
      name: 'auth.become.user',
      component: require('./pages/auth/become-an-user.vue')
    }
  ]),

  ...authGuard([
    {
      path: '/search',
      name: 'search',
      component: require('./pages/search/page.vue')
    },
    {
      path: '/appointments',
      component: require('./pages/appointments/page.vue'),
      children: [
        {
          path: '',
          name: 'appointments',
          redirect: { name: 'appointments.upcoming' }
        },
        {
          path: 'upcoming',
          name: 'appointments.upcoming',
          component: require('./pages/appointments/overview.vue')
        },
        {
          path: 'pending',
          name: 'appointments.pending',
          component: require('./pages/appointments/overview.vue')
        },
        {
          path: 'past',
          name: 'appointments.past',
          component: require('./pages/appointments/overview.vue')
        },
        {
          path: ':appointment_id/room',
          name: 'appointments.room',
          component: require('./pages/appointments/room.vue')
        }
      ]
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: require('./pages/notifications/page.vue')
    },
    {
      path: '/person/:user_id',
      component: require('./pages/profile/public-page.vue'),
      children: [
        {
          path: '',
          component: require('./pages/profile/person/preview.vue')
        }
      ]
    },
    {
      path: '/user/:user_id',
      component: require('./pages/profile/public-page.vue'),
      children: [
        {
          path: '',
          component: require('./pages/profile/user/preview.vue')
        }
      ]
    },
    {
      path: '/industry',
      component: require('./pages/industry.vue')
    },
    {
      path: '/agreement',
      component: require('./pages/agreement.vue')
    },
    // wall feed
    {
      path: '/wall',
      name: 'wall',
      component: require('./pages/wall/page.vue')
    }
  ]),
  ...adminGuard([
    {
      path: '/admin',
      component: require('./pages/admin/page.vue'),
      children: [
        {
          path: '',
          name: 'admin',
          redirect: { name: 'admin.user-list' }
        },
        {
          path: 'user-list',
          name: 'admin.user-list',
          component: require('./pages/admin/user_list.vue')
        },
        {
          path: 'invitation-code',
          name: 'admin.invitation-code',
          component: require('./pages/admin/invitation_code.vue')
        },
        {
          path: 'discount-code',
          name: 'admin.discount-code',
          component: require('./pages/admin/discount_code.vue')
        },
        {
          path: 'sign-up-code',
          name: 'admin.sign-up-code',
          component: require('./pages/admin/sign-up-code')
        }
      ]
    }
  ]),
  ...guestGuard([
    {
      path: '/admin',
      name: 'admin.login',
      component: require('./pages/admin/auth/login.vue')
    },
    {
      path: '/auth/login',
      name: 'auth.login',
      component: require('./pages/auth/login.vue'),
      meta: {
        whiteBg: true
      }
    },
    {
      path: '/auth/join',
      name: 'auth.join',
      component: require('./pages/auth/login.vue'),
      redirect: to => {
        return {
          name: to.params.allowed ? 'auth.register' : 'auth.close-register'
        }
      }
    },
    {
      path: '/auth/register',
      name: 'auth.register',
      component: require('./pages/auth/register.vue'),
    },
    {
      path: '/auth/request-access',
      name: 'auth.close-register',
      component: require('./components/CloseUserSignUp.vue')
    },
    {
      path: '/auth/register-person',
      name: 'auth.register-person',
      component: require('./pages/auth/register-person.vue')
    },
    {
      path: '/password/reset',
      name: 'password.request',
      component: require('./pages/auth/password/email.vue'),
      meta: {
        whiteBg: true
      }
    },
    {
      path: '/password/reset/:token',
      name: 'password.reset',
      component: require('./pages/auth/password/reset.vue'),
      meta: {
        whiteBg: true
      }
    }
  ]),
  {
    path: '*', name:
      'not-found',
    component: require('./pages/errors/404.vue')
  }
]
