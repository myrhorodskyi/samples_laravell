<template>
  <div class="__vev_calendar-wrapper">
    <div class="cal-wrapper ">
      <div class="cal-header card">
        <div class="l btn-calendar-control" @click="preMonth">
          <div class="arrow-left"></div>
        </div>
        <div class="cal-header_title">
          <div class="cal-header_mounth">{{curMonthFull}}</div>
          <div class="cal-header_year">{{curYearFull}}</div>
        </div>
        <div class="r btn-calendar-control" @click="nextMonth">
          <div class="arrow-right"></div>
        </div>
      </div>
      <div class="cal-body">
        <div class="weeks">
          <span v-for="dayName in i18n[calendar.options.locale].dayNames" class="item">{{dayName}}</span>
        </div>
        <div class="dates">
          <div :class="range.start_date !== null && range.end_date !== null  ? 'range-selected' : '' "  v-for="date in dayList" @click="handleChangeCurday(date)" class="item">
            <p class="date-num"
               :style="{
                        color: isDisabledDay(date) ? '#e2e2e2': date.status == 2 ? customColor : 'inherit'}">
              {{date.status ? date.date.split('/')[2] : '&nbsp'}}</p>
            <span
              v-if="date && (isToday(date) || false) && date.status"
              :class="{
                    'is-today': isToday(date),
                    'is-selected': false
                  }"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import i18n from './src/i18n.js'
import { dateTimeFormatter, isEqualDateStr, isPastDate} from './src/tools.js'
import {mapGetters, mapActions} from  'vuex';


const inBrowser = typeof window !== 'undefined';

export default {
  name: 'clover-search-calendar',
  data () {
    return {
      i18n,
      range: {
        start_date: null,
        end_date: null,
      },
    }
  },
  computed: {
    dayList () {
      let tempArr = [],
        month = this.calendar.params.curYear + '/' + (this.calendar.params.curMonth+1) + '/01',
        dayOfStartMonth = moment(month, 'YYYY/MM').day(),
        startDate = moment(month, 'YYYY/MM').subtract(dayOfStartMonth, 'days');
      let start = !_.isEmpty(this.range.start_date) ? moment(this.range.start_date.date, 'YYYY-MM-DD').unix() : 0,
        end = !_.isEmpty(this.range.end_date) ? moment(this.range.end_date.date, 'YYYY-MM-DD').unix() : 0;

      for (let i = 0 ; i < 42 ; i++) {
        let status = this.calendar.params.curMonth === startDate.month() ? 1 : 0;
        if(start <= startDate.unix() && startDate.unix() <= end) {
          status = 2
        }
        let tempItem = {
          date: startDate.format('YYYY/MM/DD'),
          status: status,
          tempSelected: false
        };
        tempArr.push(tempItem);
        startDate.add(1, 'days');
      }
      return tempArr
    },
    calendar () {
      let dateObj = new Date();
      if (inBrowser) {
        return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA
      } else {
        return {
          options: {
            locale: 'en', //zh
            color: ' #f29543'
          },
          params: {
            curYear: dateObj.getFullYear(),
            curMonth: dateObj.getMonth(),
            curDate: dateObj.getDate(),
            curEventsDate: 'all'
          }
        }
      }
    },
    today () {
      return moment().format('YYYY/MM/DD');
    },
    curYearMonth () {
      let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`))
      return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
    },
    customColor () {
      return this.calendar.options.color
    },
    curMonthFull() {
      let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/02`))
      return moment(tempDate).format('MMMM')
    },
    curYearFull() {
      return this.calendar.params.curYear
    },
  },
  methods: {
    nextMonth () {
      this.$EventCalendar.nextMonth()
      this.$emit('month-changed', this.curYearMonth)
    },
    preMonth () {
      this.$EventCalendar.preMonth()
      this.$emit('month-changed', this.curYearMonth)
    },
    handleChangeCurday (date) {
      if(this.isDisabledDay(date)) return;
      let tempDate = _.clone(date);
      tempDate.date = moment(tempDate.date, 'YYYY/MM/DD').format('YYYY-MM-DD');
      if(!this.range.start_date) {
        this.range.start_date = tempDate
      } else if (this.range.start_date && !this.range.end_date) {
        this.range.end_date = tempDate
      } else {
        this.range = {
          start_date: '',
          end_date: '',
        }
      }
      this.$emit('rangeChanged', this.range)
    },
    isToday (date) {
      return isEqualDateStr(date.date, this.today);
    },
    isDisabledDay(date) {
      return isPastDate(date.date) || this.isLaterThanSixMonth(date.date);
    },
    isLaterThanSixMonth(date){
      return moment().add(1, 'days').add(6, 'months') <= moment(date, 'YYYY/MM/DD');
    },
    hasTempSelected(date) {
      return date.tempSelected;
    },
    resetSelected() {
      this.range.start_date = null;
      this.range.end_date = null;
    }
  }
}
</script>
