<template>
  <div>
    <div class="slot-tooltip" v-tooltip.bottom="{content: tooltipMessage}">
      <button
        type="button"
        class="event-item btn btn-default d-flex justify-content-between align-items-center"
        :disabled="isDisabled"
        @click="slotAction"
        :class="applySlotClasses"
      >
        <span>{{ event.start_time | humanizeToActualTimeZone('LT', authUser.tz) }} - {{ eventEndTime | humanizeToActualTimeZone('LT', authUser.tz) }}</span>
        <i
          v-if="canDeleteSlot"
          @click.stop="removeTimeSlot(event, index)"
          class="btn-remove-slot"
        />
        <i
          v-if="isSelectedSlot || isRemoveSlotDraft"
          @click.stop="userRemoveTimeSlot(event)"
          class="btn-user-remove-slot"
        />
      </button>
    </div>
    <modal v-if="showModal" @close="openModal">
      <h3 slot="header">{{ event.start_time | humanizeToFormat('HH:mm') }}</h3>
      <div slot="body" />
      <div slot="footer">
        <button class="btn btn-success" @click="closeModal">
          ok
        </button>
        <button class="btn btn-outline-primary" @click="closeModal">
          Cancel
        </button>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import * as constants from '../../../../../constants'
import _ from 'lodash'
import moment from 'moment'
import swal from 'sweetalert'

export default {
  name: 'booking-slot',
  props: {
    event: {
      type: Object,
      required: true
    },
    isScheduler: {
      type: Boolean
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['appointmentEvents', 'targetUser', 'authUser', 'isProfileOwner', 'isAdvisor']),
    isSelectedSlot () {
      return this.appointmentEvents.some(event => _.isEqual(event, this.event))
    },
    isDisabled () {
      if (this.isProfileOwner) return false
      return this.tooLateForTheAppointment || (!this.canPlace && !this.isSelectedSlot)
    },
    isDraft () {
      return this.event.status === constants.SLOT_STATUS_DRAFT
    },
    isPending () {
      return this.event.status === constants.SLOT_STATUS_PENDING
    },
    isConfirmed () {
      return this.event.status === constants.SLOT_STATUS_CONFIRMED
    },
    isPast () {
      return moment.parseZone(this.event.start_time, 'X') < moment.parseZone().format('X')
    },
    canPlace () {
      return (this.appointmentEvents.length * constants.SLOT_INTERVAL_IN_MINUTES / 60) < 8
    },
    canActionUser () {
      return this.$route.name === 'appointments.request' && !this.tooLateForTheAppointment
    },
    tooLateForTheAppointment () {
      // // TODO: Just for testing
      // return false

      if (!window.location.hostname.startsWith('outvisory.com')) {
        return false
      }
      const actualSlotTime = moment.utc(this.event.start_time).format('X')
      const nearestAllowedStartTime = moment.utc().add(12, 'hours').format('X')
      return actualSlotTime < nearestAllowedStartTime
    },
    tooltipMessage () {
      if (this.isProfileOwner) {
        if (this.isSelectedSlot) return 'Scheduled'
        if (this.isDraft) return 'This slot is temporary unavailable'
        return 'Free'
      } else {
        if (this.tooLateForTheAppointment) return 'You can only book an appointment that is at least 12 hours away.'
        if (this.isDraft) return 'This slot is temporary unavailable'
        if (!this.canPlace) return 'Only two variants are available for selection'
        if (!this.canActionUser) return 'Click to select an appointment time'
        if (this.isSelectedSlot) return 'Click to unselect'
        return 'Select time'
      }
    },
    applySlotClasses () {
      return {
        'selected-time': this.isSelectedSlot || this.isDraft,
        'btn-info': this.isPending,
        'btn-primary': this.isConfirmed,
        'btn-secondary': this.isPast
      }
    },
    canDeleteSlot () {
      return this.isProfileOwner && this.event.status === constants.SLOT_STATUS_AVAILABLE
    },

    isOwnAppointment () {
      return this.event.appointment_owner !== null && (this.event.appointment_owner.id === this.authUser.id)
    },
    isRemoveSlotDraft () {
      return this.isDraft && this.isOwnAppointment
    },
    eventEndTime () {
      return moment(this.event.start_time).add(constants.SLOT_INTERVAL_IN_MINUTES, 'minutes').format('yyyy-MM-DD HH:mm:ss')
    }
  },
  methods: {
    ...mapActions([
      'addAppointmentItem', 'removeAppointmentItem', 'removeDraftAppointmentItem'
    ]),
    slotAction () {
      if (this.isScheduler || this.isSelectedSlot) {
        return
      }
      if (this.isDraft) {
        return swal('This slot is temporary unavailable. Please try again in an 10 minutes.')
      }
      if (!this.canActionUser) {
        this.addAppointmentItem(this.event)
        return this.$router.push({ name: 'appointments.request', params: { advisorId: this.targetUser.id }})
      }
      if (this.canPlace) {
        return this.addAppointmentItem(this.event)
      } else {
        return swal('Can\'t select any more time slots')
      }
    },
    openModal () {
      this.showModal = true
      document.body.classList.add('open-modal')
    },
    closeModal () {
      this.showModal = false
      document.body.classList.remove('open-modal')
    },

    removeTimeSlot (val, index) {
      this.$emit('removeSlot', val, index)
    },
    userRemoveTimeSlot (val) {
      if (this.isDraft) {
        this.event.status = constants.SLOT_STATUS_AVAILABLE
        this.event.chat_id = null
        this.removeDraftAppointmentItem(val)
      } else {
        this.removeAppointmentItem(val)
      }
    }
  }
}
</script>
<style>
.vue-tooltip.empty-tooltip {
  display: none !important;
}
</style>
