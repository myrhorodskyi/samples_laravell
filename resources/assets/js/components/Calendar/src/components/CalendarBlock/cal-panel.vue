<template>
  <div class="cal-wrapper">
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
        <div v-for="date in dayList" class="item"
          :class="{
            today: isToday(date),
            event: date.status ? (date.title != undefined) : false,
            available: isAvailable(date),
            [calendar.options.className] : (date.date == selectedDay)
          }">
          <p class="date-num"
             :class="isDisabledDay(date) ? 'disabled': ''"
            @click="handleChangeCurday(date)"
            :style="{
              color: isDisabledDay(date) ? '#e2e2e2':  isAvailable(date) ? hasTempSelected(date) ? 'green' : customColor : 'inherit'}">
            {{date.status ? date.date.split('/')[2] : '&nbsp'}}</p>
          <span
                  v-if="date && (isToday(date) || isSelectedDay(date)) && date.status"
                  :class="{
                    'is-today': isToday(date),
                    'is-selected': isSelectedDay(date)
                  }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../../i18n.js'
import { dateTimeFormatter, isEqualDateStr, isPastDate} from '../../tools.js'
import {mapGetters, mapActions} from  'vuex';

const inBrowser = typeof window !== 'undefined';

export default {
  name: 'cal-panel',
  data () {
    return {
      i18n
    }
  },
  props: {
    events: {
      type: Array,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    },
    selectedDay: {
      type: String,
      required: false
    },
    scheduledDays: {
        type: Array,
        required: true
    },
    isScheduler: {
      type: Boolean
    }
  },
  computed: {
      ...mapGetters(['appointmentEvents']),
    dayList () {
        let tempArr = [],
            month = this.calendar.params.curYear + '/' + (this.calendar.params.curMonth+1) + '/01',
            dayOfStartMonth = moment(month, 'YYYY/MM').day(),
            startDate = moment(month, 'YYYY/MM').subtract(dayOfStartMonth, 'days');

        for (let i = 0 ; i < 42 ; i++) {
            let status = this.calendar.params.curMonth === startDate.month() ? 1 : 0,
                tempItem = {
                    date: startDate.format('YYYY/MM/DD'),
                    status: status,
                    tempSelected: false
                };
            this.scheduledDays.forEach((item) => {
                if (isEqualDateStr(item.date, tempItem.date)) {
                    tempItem.status = item.status;
                }
            });
            this.appointmentEvents.forEach((item) => {
                if (isEqualDateStr(item.date, tempItem.date)) {
                    tempItem.tempSelected = true;
                }
            });
            tempArr.push(tempItem);
            startDate.add(1, 'days');
        }
        return tempArr
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

    curYearFull() {
        return this.calendar.params.curYear
    },

    curMonthFull() {
        let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/02`))
        return moment(tempDate).format('MMMM')
    }
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
      if (!this.isDisabledDay(date.date) && date.status) {
          if(this.isAvailable(date) || this.isScheduler || this.isToday(date)){
              this.$emit('cur-day-changed', date.date)
          }
      }
    },
    isAvailable (date) {
        if(!this.isDisabledDay(date)) {
            return date.status == 'available';
        }
    },
    isToday (date) {
        return isEqualDateStr(date.date, this.today);
    },
    isSelectedDay(date) {
        return isEqualDateStr(date.date, this.selectedDay);
    },
    isDisabledDay(date) {
        return isPastDate(date.date) || this.isLaterThanSixMonth(date.date);
    },
    isLaterThanSixMonth(date){
        return moment().add(1, 'days').add(6, 'months') <= moment(date, 'YYYY/MM/DD');
    },
    hasTempSelected(date) {
        return date.tempSelected;
    }
  }
}
</script>
