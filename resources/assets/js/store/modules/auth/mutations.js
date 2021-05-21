import * as types from '../../mutation-types'
import { setItem, unsetItem } from '../../helpers'
import Cookies from 'js-cookie'
import moment from 'moment'
import _ from 'lodash'

export default {
  [types.SAVE_AUTH_TOKEN]: (state, { token, expires_in }) => {
    Cookies.set('token', token, { expires: expires_in ? expires_in : null })
    return setItem(state, token, 'authToken')
  },
  [types.SAVE_AUTH_USER]: (state, { user }) => {
    user.interested_industries.forEach((v, k) => {
      delete user.interested_industries[k].pivot
    })
    user.birthday = moment(user.birthday).format('YYYY-MM-DD HH:mm:ss')
    user.roles = _.map(user.roles, 'name')
    if (!_.isEmpty(user.person)) {
      user.person.industries.forEach((v, k) => {
        delete user.person.industries[k].pivot
      })
      user.person.offers.forEach((v, k) => {
        delete user.person.offers[k].pivot
      })
    }
    return setItem(state, user, 'authUser')
  },
  [types.REMOVE_AUTH_USER]: (state) => unsetItem(state, 'authUser'),
  [types.REMOVE_AUTH_TOKEN]: (state) => {
    Cookies.remove('token')
    return unsetItem(state, 'authToken')
  }
}
