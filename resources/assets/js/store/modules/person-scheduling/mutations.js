import * as types from '../../mutation-types'
import moment from 'moment'
import _ from 'lodash'

export default {
  [types.PERSON_DAILY_EVENTS] (state, { data }) {
    state.dailyEvents = data
  },
  [types.PERSON_MONTHLY_EVENTS] (state, { data }) {
    const dates = []
    data.forEach((v) => {
      const item = {}
      item.date = moment(v.date).format('YYYY/MM/DD')
      item.status = _.indexOf(v.statuses, 'available') !== -1 ? 'available' : 'unavailable'
      dates.push(item)
    })
    state.monthlyEvents = dates
  }
}
