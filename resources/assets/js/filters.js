import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'

Vue.filter('ucfirst', str => _.upperFirst(str))

Vue.filter('firstChar', str => str.slice(0, 1))

Vue.filter('money', number => number / 100)

Vue.filter('uppercase', str => _.upperCase(str))

Vue.filter('humanizeFormatToFormat', (str, inputFormat, outputFormat) => moment.parseZone(str, inputFormat).format(outputFormat))

Vue.filter('humanizeToFormat', (str, format) => moment.parseZone(str).format(format))

Vue.filter('centsToDollars', str => str / 100)

Vue.filter('two_digits', value => value.toString().length <= 1 ? '0' + value.toString() : value.toString())

Vue.filter('truncateString', (str, value) => str.substring(0, value) + '...')

Vue.filter('diffBetweenDates', (start_date, end_date, inputFormat, outputFormat) => {
  const m = moment(start_date, inputFormat).diff(moment(end_date, inputFormat))
  const hours = moment.utc(m).format('H')
  const minutes = moment.utc(m).format('m')
  const prefix = hours > 1 ? 'hours ' : 'hour '
  return (hours > 0 ? hours + ' ' + prefix : '') + (minutes > 0 ? minutes + ' mins' : '')
})

Vue.filter('humanizeToActualTimeZone', (str, format, tz) => moment.utc(str).tz(tz).format(format))

Vue.filter('humanizeWithoutTime', (str) => moment(str).format('MM/DD/YYYY'))
