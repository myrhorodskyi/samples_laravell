import _ from 'lodash'

export default {
  methods: {
    datesOrdered () {
      let datesUnordered = {}, prevEndTime, datesOrdered = {}
      this.item.hourly_events.forEach((v) => {
        if (!_.isArray(datesUnordered[v.date])) {
          datesUnordered[v.date] = []
        }
        if (v.time_start !== prevEndTime) {
          const period = {
            time_start: v.time_start,
            time_end: v.time_end
          }
          datesUnordered[v.date].push(period)
        } else {
          const tempIndex = _.findIndex(datesUnordered[v.date], ['time_end', v.time_start])
          datesUnordered[v.date][tempIndex]['time_end'] = v.time_end
        }
        prevEndTime = v.time_end
      })

      Object.keys(datesUnordered).sort().forEach(function (key) {
        datesOrdered[key] = datesUnordered[key]
      })
      return datesOrdered
    }
  }
}
