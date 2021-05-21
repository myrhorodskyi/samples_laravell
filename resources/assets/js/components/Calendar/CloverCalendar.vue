<template>
  <div>
    <div v-if="showPreload" class="time-slot-preloader col-md-4">
      <preload v-if="showPreload"></preload>
    </div>
    <vue-event-calendar
      :events="events"
      :scheduledDays="scheduledDays"
      :selectedDay="selectedDay"
      :isScheduler="isProfileOwner"
      :showPreload="this.showPreload"
      @schedule="reloadCalendar"
      @day-changed="handleDayChanged"
      @month-changed="handleMonthChanged"
    >
      <template scope="props">
        <TimeSlot
          v-for="(event, index) in events"
          :key="index"
          :index="index"
          :event="event"
          :isScheduler="isProfileOwner"
          @removeSlot="handleRemoveSlot"
          class="d-inline-block"
        />
      </template>
    </vue-event-calendar>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import eventCalendar from './src'
import TimeSlot from './src/components/EventsBlock/time-slot.vue'
import Preload from '../../components/Preload.vue'
import moment from 'moment'

Vue.use(eventCalendar, { locale: 'en', color: '#fe7871' })

export default {
  name: 'clover-calendar',
  data () {
    return {
      selectedDay: '',
      loading: false
    }
  },
  components: {
    Preload,
    TimeSlot
  },
  props: {
    targetUser: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'authUser',
      dailyEvents: 'dailyEvents',
      scheduledDays: 'monthlyEvents',
      isProfileOwner: 'isProfileOwner'
    }),
    showPreload () {
      return this.loading
    },
    events () {
      return this.dailyEvents
    }
  },
  created () {
    this.selectedDay = moment().format('YYYY/MM/DD')
    if (_.isEmpty(this.targetUser)) return
    const request = this.makeRequestObject()
    this.getMonthlyEvents(request)
    this.handleGetDailyEvents(request)
  },
  methods: {
    ...mapActions(['getDailyEvents', 'getMonthlyEvents', 'removeDailyEvent', 'removeRecurringEvents']),
    handleDayChanged (val) {
      this.selectedDay = val.date
      const request = this.makeRequestObject(moment(this.selectedDay, 'YYYY/MM/DD'))
      this.handleGetDailyEvents(request)
    },
    handleMonthChanged (val) {
      const request = this.makeRequestObject(moment(val, 'MM/YYYY'))
      this.getMonthlyEvents(request)
    },
    reloadCalendar () {
      const request = this.makeRequestObject(moment(this.selectedDay, 'YYYY/MM/DD'))
      this.getMonthlyEvents(request)
      this.handleGetDailyEvents(request)
    },
    makeRequestObject (date) {
      return {
        date: date ? date.format('YYYY:MM:DD') : moment().format('YYYY:MM:DD'),
        userId: this.targetUser.id
      }
    },

    handleGetDailyEvents (request) {
      this.loading = true
      this.getDailyEvents(request).then(() => {
        this.loading = false
      })
    },
    handleRemoveSlot (val, index) {
      swal({
        buttons: {
          once: {
            text: 'Remove just the one time slot',
            value: 'once',
            visible: true
          },
          recurring: {
            text: 'Remove all the recurring time slots',
            value: 'recurring',
            visible: true
          },
          cancel: {
            text: 'Cancel',
            value: 'cancel',
            visible: true
          }
        },
        className: 'remove-slot-modal',
        title: 'Delete slot',
        text: 'Please confirm whether you want to delete this time slot for only the selected date or delete all recurrences of the selected time slot.',
        type: 'info',
        icon: 'info',
        showCancelButton: true
      }).then((value) => {
        if (value === 'once') {
          this.removeDailyEvent(val)
            .then(() => {
              this.events.splice(index, 1)
              swal({
                title: 'Deleted!',
                text: 'Time slot has been deleted.',
                icon: 'success',
                type: 'success'
              })
            })
        } else if (value === 'recurring') {
          this.removeRecurringEvents(val).then(() => {
            this.events.splice(index, 1)
          }).then(() => {
            swal('Deleted!', 'All the recurring time slots for that particular time slot has been deleted', 'success')
          })
        }
      }).catch((rej) => {
        console.error(rej)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.time-slot-preloader {
  position: absolute;
  top: 50%;
  @media(max-width: 776px) {
    bottom: 0;
  }
}
</style>
