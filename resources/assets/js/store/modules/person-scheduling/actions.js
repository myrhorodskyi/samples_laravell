import axios from 'axios'
import moment from 'moment'
import * as types from '../../mutation-types'

const fixPeriod = ({ end_time: e, start_time: s }) => {
  const startAt = moment(`${s.hh} ${s.mm} ${s.A}`, 'hh mm A')
  const endAt = moment(`${e.hh} ${e.mm} ${e.A}`, 'hh mm A')
  return {
    start_time: {
      hh: startAt.hour(),
      mm: startAt.minute()
    },
    end_time: {
      hh: endAt.hour(),
      mm: endAt.minute()
    }
  }
}
export const validatePersonSchedule = async ({ commit }, params) => {
  try {
    const { userId, data } = params
    const props = {
      ...data,
      periods: data.periods.map(fixPeriod)
    }
    const uri = `/api/person/${userId}/schedule/validate`
    await axios.post(uri, props)
    return true
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const setPersonSchedule = async ({ commit }, params) => {
  try {
    const { userId, data } = params
    const props = {
      ...data,
      periods: data.periods.map(fixPeriod)
    }
    const uri = `/api/person/${userId}/schedule`
    await axios.post(uri, props)
    return true
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getDailyEvents = ({ commit }, params) => {
  return new Promise(async (resolve, reject) => {
    axios.get('/api/person/' + params.userId + '/schedule/daily', { params: { date: params.date }})
      .then(({ data }) => {
        commit(types.PERSON_DAILY_EVENTS, { data })
        resolve(data)
      })
      .catch((rej) => {
        reject()
      })
  })
}

export const getMonthlyEvents = ({ commit }, params) => {
  return new Promise(async (resolve, reject) => {
    axios.get('/api/person/' + params.userId + '/schedule/monthly', { params: { date: params.date }})
      .then(({ data }) => {
        commit(types.PERSON_MONTHLY_EVENTS, { data })
        resolve()
      })
      .catch((rej) => {
        reject()
      })
  })
}

export const removeDailyEvent = ({ commit }, params) => {
  return new Promise(async (resolve, reject) => {
    axios.post('/api/person/' + params.persons_user_id + '/schedule/remove-slot', params)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((rej) => {
        reject()
      })
  })
}

export const removeRecurringEvents = ({ commit }, params) => {
  return new Promise(async (resolve, reject) => {
    axios.post('/api/person/' + params.persons_user_id + '/schedule/remove-recurring-slots', params)
      .then(({ data }) => {
        resolve(data)
      })
      .catch((rej) => {
        reject()
      })
  })
}
