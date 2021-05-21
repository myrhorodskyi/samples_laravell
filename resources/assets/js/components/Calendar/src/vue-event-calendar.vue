<template>
  <div class="__vev_calendar-wrapper row">

    <div class="col-md-4 m-0">
      <cal-events
        class=""
        :isScheduler="isScheduler"
        :dayEvents="selectedDayEvents"
        :selectedCurrentDay="this.selectedDay"
        :locale="calendarOptions.options.locale"
        :showPreload="this.showPreload"
        @scheduleAdded='$emit("schedule-added")'
        :color="'#ffffff'"
      >
        <slot :showEvents="selectedDayEvents.events"></slot>
      </cal-events>
      <div class="row col-md-12 p-0" slot="ownerOptions" :class="addHeightButton">
        <schedule-form
          v-if="isScheduler"
          :events="events"
          :eventLength=events.length
          @schedule="$emit('schedule')"
          :selectedDay="selectedDayEvents.date"
        />
      </div>
    </div>
    <div class="col-md-8 p-0">

      <!--Only for mobile devices-->

      <div class="row m-0 align-items-center event-header hidden-md-up">
        <div class="event_day">{{ selectedCurrentDayTitle }}</div>
        <div class="col p-0">
          <div class="event_day_of_week">{{ dayOfWeekEvent }}</div>
          <div class="event-timezone hidden-md-up">
            Timezone: {{ userTimeZone }}
          </div>
        </div>
      </div>

      <!-- End -->

      <cal-panel
        :events="events"
        :calendar="calendarOptions"
        :scheduledDays="scheduledDays"
        :selectedDay='selectedDayEvents.date'
        :isScheduler="isScheduler"
        @cur-day-changed="handleChangeCurDay"
        @month-changed="handleMonthChanged">
      </cal-panel>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { isEqualDateStr } from './tools.js'
import moment from 'moment'
import calEvents from './components/EventsBlock/cal-events.vue'
import calPanel from './components/CalendarBlock/cal-panel.vue'
import scheduleForm from './components/EventsBlock/schedule-form.vue'
import { getTimeZoneName } from '../../../zone_name'

const inBrowser = typeof window !== 'undefined'
export default {
  name: 'vue-event-calendar',
  components: {
    'cal-events': calEvents,
    'cal-panel': calPanel,
    'schedule-form': scheduleForm
  },
  data () {
    return {
      selectedDayEvents: {
        date: 'all',
        events: this.events || [] //default show all event
      },
      user_timezone: ''
    }
  },
  props: {
    events: {
      type: Array,
      required: true,
      default: [],
      validator (events) {
        let validate = true
        events.forEach((event, index) => {
          if (!event.start_time) {
            console.error('Vue-Event-Calendar-Error:' + 'Prop events Wrong at index ' + index)
            validate = false
          }
        })
        return validate
      }
    },
    scheduledDays: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedDay: {
      type: String
    },
    isScheduler: {
      type: Boolean
    },
    showPreload: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['appointmentEvents']),
    calendarOptions () {
      if (inBrowser) {
        return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA
      } else {
        const dateObj = new Date()
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
    calendarParams () {
      if (inBrowser) {
        return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA.params
      } else {
        // TODO: Re-check in the suitable environment
        const dateObj = new Date()
        return {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: dateString
        }
      }
    },

    selectedCurrentDayTitle () {
      return moment.utc(this.selectedDay).format('D')
    },

    dayOfWeekEvent () {
      return moment.utc(this.selectedDay).format('dddd')
    },

    userTimeZone () {
      return getTimeZoneName(this.user_timezone)
    },

    addHeightButton () {
      if (this.appointmentEvents.length > 0 && this.selectedDayEvents.events.length < 4) {
        return 'cal-event__button-top'
      } else if (this.appointmentEvents.length === 0) {
        return ''
      } else {
        return 'cal-event__button-top__many-event'
      }
    }
  },
  created () {
    if (this.calendarParams.curEventsDate !== 'all') {
      this.handleChangeCurDay(this.calendarParams.curEventsDate)
    }

    this.handleGetAuthUserTimezone()
  },
  methods: {
    ...mapActions(['getAuthUserTimezone']),
    handleChangeCurDay (date) {
      const events = this.events.filter(function (event) {
        return isEqualDateStr(event.date, date)
      })
      this.selectedDayEvents = {
        date: date,
        events: events
      }
      this.$emit('day-changed', this.selectedDayEvents)
    },
    handleMonthChanged (yearMonth) {
      this.$emit('month-changed', yearMonth)
    },
    handleGetAuthUserTimezone () {
      return this.getAuthUserTimezone().then(response => {
        this.user_timezone = response
      })
    }
  },
  watch: {
    calendarParams () {
      if (this.calendarParams.curEventsDate !== 'all') {
        let events = this.events.filter(event => {
          return isEqualDateStr(event.date, this.calendarParams.curEventsDate)
        })
        this.selectedDayEvents = {
          date: this.calendarParams.curEventsDate,
          events
        }
      } else {
        this.selectedDayEvents = {
          date: 'all',
          events: this.events
        }
      }
    },
    events () {
      this.selectedDayEvents = {
        date: this.selectedDay,
        events: this.events || []
      }
    }
  }
}
</script>
