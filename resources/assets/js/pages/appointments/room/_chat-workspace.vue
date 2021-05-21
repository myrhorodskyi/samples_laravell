<template>
  <div class="col chat-col p-0">
    <div class="col-md-12" v-if="isDraftAppointment">
      <div class="title text-center">
        Appointment in draft state
      </div>
    </div>
    <div class="col-md-12" v-else-if="isPendingAppointment">
      <template v-if="isAppointmentOwner">
        <div class="title text-center">
          Your appointment has not yet been confirmed by the Person.
        </div>
      </template>
      <template v-else>
        <div class="title text-center">
          You have not yet confirmed this appointment
        </div>
      </template>
    </div>
    <div class="col-md-12" v-else-if="isCanceledAppointment || isRejectedAppointment">
      <template v-if="isCanceledAppointment">
        <div class="title text-center">
          This Appointment is Canceled
        </div>
      </template>
      <template v-else>
        <div class="title text-center">
          Appointment is rejected by person
        </div>
      </template>
    </div>
    <div class="col-md-12" v-else>
      <appointment-chat-section></appointment-chat-section>
      <appointment-text-chat-section></appointment-text-chat-section>
    </div>
  </div>
</template>
<script>
import appointmentWorker from '../../../mixins/appointmentsWorker'
import ChatSection from './workspace/_chat.vue'
import TextChatSection from './workspace/_text-chat.vue'

export default {
  mixins: [appointmentWorker],
  components: {
    'appointment-chat-section': ChatSection,
    'appointment-text-chat-section': TextChatSection,
  },
  methods: {
  }
}
</script>
