import * as types from '../../mutation-types'
import { setItem, removeItem, pushItem, addOrUpdateItem } from '../../helpers'

export default {
  [types.APPOINTMENT_CHATS_SET]: (state, chats) => setItem(state, chats, 'appointmentChats'),
  [types.APPOINTMENT_CHAT_ADD_OR_UPDATE]: (state, item) => addOrUpdateItem(state, item, 'id', 'appointmentChats'),
  [types.APPOINTMENT_CHAT_SET]: (state, item) => setItem(state, item, 'chat'),
  [types.APPOINTMENT_CHAT_ONLINE_USERS_SET]: (state, users) => setItem(state, users, 'onlineUsers'),
  [types.APPOINTMENT_CHAT_ONLINE_USERS_PUSH_USER]: (state, user) => pushItem(state, user, 'onlineUsers'),
  [types.APPOINTMENT_CHAT_ONLINE_USERS_REMOVE_USER]: (state, user) => removeItem(state, user, 'onlineUsers'),
  [types.APPOINTMENT_CHAT_SET_OPENTOK_KEY]: (state, key) => (state.openTok.otKey = key),
  [types.APPOINTMENT_CHAT_SET_OPENTOK_SESSION]: (state, session) => (state.openTok.otSessionId = session),
  [types.APPOINTMENT_CHAT_SET_OPENTOK_TOKEN]: (state, token) => (state.openTok.otToken = token),
  [types.APPOINTMENT_CHAT_SET_OPENTOK_STREAM]: (state, stream) => (state.openTok.stream = stream)
}
