import * as types from '../../mutation-types'
import _ from 'lodash'

export default {
  [types.PROFILE_USER] (state, { user }) {
    state.targetUser = user
    state.targetUser.roles = _.map(user.roles, 'name')
    if (user.advisor) {
      user.advisor.offers.forEach((v, k) => {
        delete user.advisor.offers[k].pivot
      })
    }
  },
  [types.PROFILE_ADVISOR_SET_PREVIEW_MODE] (state) {
    state.isPreviewMode = true
  },
  [types.PROFILE_ADVISOR_UNSET_PREVIEW_MODE] (state) {
    state.isPreviewMode = false
  }
}
