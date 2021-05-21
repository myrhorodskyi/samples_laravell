<template>
  <div class="events-wrapper text-center">
    <div class="row m-0 align-items-center event-header hidden-sm-down">
      <div class="event_day">{{ selectedCurrentDayTitle }}</div>
      <div class="col p-0">
        <div class="event_day_of_week">{{ dayOfWeekEvent }}</div>
        <div class="event-timezone hidden-md-up">
          Timezone: {{ timezone }}
        </div>
        <div class="row">
          <div class="col-md-12 col-sm-6 text-left hidden-sm-down">
            <div class="event_mounth d-inline-block">{{ monthEvent }},</div>
            <div class="event_year d-inline-block">{{ yearEvent }}</div>
          </div>
        </div>
      </div>
    </div>

    <div style="line-height: 1.5" class="event-timezone hidden-sm-down">
      Timezone: {{ timezone }}
    </div>

    <slot name="ownerOptions" />

    <div class="row">
      <div class="col-12">
        <div class="cal-events row" v-if="events.length">
          <slot>
            <div v-for="(event, index) in events" class="event-item">
              <cal-event-item
                :event="event"
                :isScheduler="isScheduler"
                :index="index"
                :locale="locale"
              />
            </div>
          </slot>
        </div>
        <div class="sub-title text-center m-0-auto pt-2 align-items-center" v-if="!events.length && !this.showPreload">
          <span v-if="isProfileOwner">You have no availability today.</span>
          <span v-else>No available time slots</span>
        </div>
      </div>
    </div>

    <div class="selected-day-list row d-flex justify-content-center">
      <div v-if="appointmentEvents.length" class="dashed-border"></div>
      <div v-for="(item, index) in ownerAppointmentEvents" class="d-flex justify-content-center">
        <button
          type="button"
          class="w-100 h-auto my-1 selected-time btn btn-default d-flex justify-content-between align-items-center"
        >
          <span class="pr-1">
            {{ index + 1 }})
          </span>
          <div class="d-flex flex-wrap">
            <span class="d-flex flex-nowrap px-1">
              <b>{{ item.start_time | humanizeWithoutTime }}</b>
            </span>
            <span class="d-flex flex-nowrap px-1">
              {{ item.start_time | humanizeToActualTimeZone('LT', authUser.tz)  }} - {{ ownerEndTime(item.start_time) }}
            </span>
          </div>
          <span>
            <i
              class="btn-user-remove-slot"
              @click.stop="deleteSelectedTimeSlot(item)"
            />
          </span>
        </button>

      </div>
      <div class="col-12 justify-content-center" v-if="ownerAppointmentEvents.length">
        <!--   TODO: Look at .env file. The 0.5 value should be calculated from SLOT_MINUTES_INTERVAL variable     -->
        Total selected time: {{ ownerAppointmentEvents.length * 0.5 }}h
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import i18n from '../../i18n.js'
import { dateTimeFormatter } from '../../tools.js'
import calEventItem from './cal-event-item.vue'
import { getTimeZoneName } from '../../../../../zone_name'
import moment from 'moment'
import * as constants from '../../../../../constants'

export default {
  name: 'cal-events',
  data () {
    return {
      i18n,
      showModal: false,
      now: moment(),
      user_timezone: '',
      arrEventId: []
    }
  },
  components: {
    'cal-event-item': calEventItem
  },
  props: {
    dayEvents: {
      type: Object,
      required: true
    },
    locale: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    isScheduler: {
      type: Boolean
    },
    selectedCurrentDay: {
      type: String,
      required: false
    },
    showPreload: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['appointmentEvents', 'isProfileOwner', 'targetUser', 'authUser']),
    selectedCurrentDayTitle () {
      return moment.utc(this.selectedCurrentDay).format('D')
    },
    dayEventsTitle () {
      let title
      if (!this.events.length) {
        title = `${this.selectedDay} ${i18n[this.locale].notHaveEvents}`
      } else {
        title = i18n[this.locale].dayEventsTitle
      }
      return title
    },
    dayOfWeekEvent () {
      return moment.utc(this.selectedCurrentDay).format('dddd')
    },
    monthEvent () {
      return moment.utc(this.selectedCurrentDay).format('MMMM')
    },
    yearEvent () {
      return moment.utc(this.selectedCurrentDay).format('YYYY')
    },
    events () {
      return this.dayEvents.events
    },
    bgColor () {
      return { backgroundColor: this.color }
    },
    selectedDay () {
      let selectedDay
      if (this.events.length) {
        selectedDay = this.events[0].start_time
      } else {
        selectedDay = moment()
      }
      return moment(selectedDay).format('MM/DD/YYYY')
    },
    timezone () {
      return getTimeZoneName(this.authUser.tz)
    },
    ownerEvents () {
      return this.$route.params.user_id
    },
    ownerAppointmentEvents () {
      return this.appointmentEvents.filter((el) => {
        if (this.arrEventId.includes(el.id)) {
          return el.advisors_user_id === +this.ownerEvents
        }
      })
    }
  },
  watch: {
    'events': function (val) {
      val.map((el) => {
        this.arrEventId.push(el.id)
      })
    }
  },
  methods: {
    ...mapActions(['getAuthUserTimezone', 'removeDraftAppointmentItem', 'removeAppointmentItem']),
    dateTimeFormatter,
    saveSchedule () {
      this.showModal = false
    },
    ownerEndTime (value) {
      const time = moment(value).add(constants.SLOT_INTERVAL_IN_MINUTES, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      return moment.utc(time).tz(this.authUser.tz).format('LT')
    },
    deleteSelectedTimeSlot (item) {
      if (item.status === constants.SLOT_STATUS_DRAFT) {
        item.status = constants.SLOT_STATUS_AVAILABLE
        item.chat_id = null
        this.removeDraftAppointmentItem(item)
      }
      this.removeAppointmentItem(item)
    }
  }
}
</script>
