import _ from 'lodash'

export const authToken = state => {
  return state.authToken
}
export const authCheck = state => {
  return state.authUser !== null
}

export const authUser = state => {
  return state.authUser
}

export const isAdmin = state => {
  if (!state.authUser) return false
  return _.indexOf(state.authUser.roles, 'admin') > -1
}

export const isPerson = state => {
  if (!state.authUser) return false
  return _.indexOf(state.authUser.roles, 'person') > -1
}

export const isUser = state => {
  if (!state.authUser) return false
  return _.indexOf(state.authUser.roles, 'user') > -1
}
