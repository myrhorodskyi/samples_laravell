import * as types from '../../mutation-types'
import _ from 'lodash'
import axios from 'axios'

export const setActiveChat = ({ commit }, item) => {
  commit(types.APPOINTMENT_CHAT_SET, item)
}

export const setAppointmentChats = ({ commit }, chats) => {
  commit(types.APPOINTMENT_CHATS_SET, chats)
}

export const updateChat = ({ commit }, item) => {
  commit(types.APPOINTMENT_CHAT_ADD_OR_UPDATE, item)
}

export const retrieveCredentils = ({ state, dispatch }) => {
  return new Promise(async (resolve, reject) => {
    if (_.isEmpty(state.chat)) reject()
    axios.post('/api/chats/' + state.chat.id + '/ready-for-the-chat')
      .then(({ data }) => {
        dispatch('setOpentokCreds', data)
        resolve()
      })
      .catch((rej) => {
        reject(rej)
      })
  })
}

export const resetCurrentOpentokSession = ({ state, dispatch }) => {
  return new Promise(async (resolve, reject) => {
    dispatch('abortOpentokConnection')
    const keys = Object.keys(state.openTok)
    keys.forEach(v => {
      state.openTok[v] = state.constants.openTok[v].defaultValue
    })
    resolve()
  })
}
export const toggleChatConnection = ({ getters, state, dispatch }) => {
  if (getters.isPublished) {
    dispatch('unpublishToSession')
  } else {
    dispatch('publishToSession')
  }
}

export const setOpentokCreds = ({ state, commit }, opentokData) => {
  return new Promise(async (resolve, reject) => {
    if (!_.has(opentokData, 'ot_api_key', 'ot_session_id', 'ot_token')) reject()
    commit(types.APPOINTMENT_CHAT_SET_OPENTOK_KEY, opentokData.ot_api_key)
    commit(types.APPOINTMENT_CHAT_SET_OPENTOK_SESSION, opentokData.ot_session_id)
    commit(types.APPOINTMENT_CHAT_SET_OPENTOK_TOKEN, opentokData.ot_token)
    resolve()
  })
}

export const initializeOpentokSession = ({ state, commit }) => {
  return new Promise(async (resolve, reject) => {

    // Create a session
    const session = OT.initSession(state.openTok.otKey, state.openTok.otSessionId)
    session
      .on('streamCreated', event => {
        const subscriberOptions = {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          style: { buttonDisplayMode: 'off' }
        }
        commit(types.APPOINTMENT_CHAT_SET_OPENTOK_STREAM, event.stream)
        state.openTok.subscriber = session.subscribe(state.openTok.stream, 'subscriber', subscriberOptions, (error) => {
          if (error) console.log(error)
        })
      })
      .on('streamDestroyed', event => {
        session.unsubscribe(event.stream)
      })
    session.connect(state.openTok.otToken, (error) => {
      if (error) reject(error)
    })
    state.openTok.session = session
    resolve()
  })
}

export const publishToSession = ({ state, getters }) => {
  return new Promise(async (resolve, reject) => {
    let publisher,
      session = state.openTok.session,
      type = getters.appointment.type
    const publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      publishVideo: type === 'video',
      style: { buttonDisplayMode: 'off' }
    }
    publisher = OT.initPublisher('publisher', publisherOptions, (error) => {
      if (error) reject(error)
      if (getters.isConnected) {
        session.publish(publisher, error => {
          if (error) reject(error)
        })
      }
    })
    state.openTok.publisher = publisher
    resolve()
  })
}
export const unpublishToSession = ({ state, getters }) => {
  return new Promise(async (resolve, reject) => {
    let publisher = state.openTok.publisher,
      session = state.openTok.session
    if (state.openTok.stream) {
      session.unsubscribe(state.openTok.stream)
    }
    session.unpublish(publisher)
    state.openTok.publisher = null
    resolve()
  })
}

export const unpublishShare = ({ state, getters }) => {
  return new Promise(async (resolve, reject) => {
    let screenSharingPublisher = state.openTok.screenSharingPublisher,
      session = state.openTok.session
    session.unpublish(screenSharingPublisher)
    state.openTok.screenSharingPublisher = null
    resolve()
  })
}

export const publishShare = ({ state, getters, dispatch }) => {
  return new Promise(async (resolve, reject) => {
    const el = 'screen-publisher'
    let session = state.openTok.session,
      screenSharingPublisher = OT.initPublisher(el, { videoSource: 'screen' }, function (error) {
        if (error) {
          console.log(error)
        } else {
          session.publish(
            screenSharingPublisher,
            function (error) {
              if (error) {
                swal({
                  type: 'error',
                  title: 'Oops...Something went wrong:',
                  text: error.message,
                  icon: 'error'
                })
              }
            })
          screenSharingPublisher.on('streamDestroyed', function () {
            dispatch('unpublishShare')
          })

          state.openTok.screenSharingPublisher = screenSharingPublisher
          resolve()
        }
      })
  })
}

export const abortOpentokConnection = ({ state, getters }) => {
  return new Promise(async (resolve) => {
    if (getters.isConnected) {
      state.openTok.session.off('streamCreated').off('streamDestroyed')
      state.openTok.session.disconnect()
    }
    resolve()
  })
}

export const setOnlineUsers = ({ commit }, users) => {
  commit(types.APPOINTMENT_CHAT_ONLINE_USERS_SET, users)
}

export const pushNewConnectedUser = ({ commit }, user) => {
  commit(types.APPOINTMENT_CHAT_ONLINE_USERS_PUSH_USER, user)
}

export const removeDisconectedUser = ({ commit }, user) => {
  commit(types.APPOINTMENT_CHAT_ONLINE_USERS_REMOVE_USER, user)
}
