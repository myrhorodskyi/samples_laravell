<template>
  <div class="l_room" v-if="ready">
    <section>
      <div class="d-flex align-items-start">
        <appointment-details-section></appointment-details-section>
        <appointment-chat-workspace></appointment-chat-workspace>
        <div class="col flex-column chat-control-col p-0">
          <appointment-persons-section></appointment-persons-section>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import DetailsSection from './room/_details.vue'
import ChatWorkspace from './room/_chat-workspace.vue'
import PersonsSection from './room/_persons.vue'
import * as constants from '../../constants';
import * as browserDetect from "../../browserDetect";

export default {
  components: {
    'appointment-details-section': DetailsSection,
    'appointment-chat-workspace' : ChatWorkspace,
    'appointment-persons-section': PersonsSection,
  },
  data(){
    return {
      ready: false
    }
  },
  created(){
    browserDetect.getBrowserSupportModal();
    this.getAppointment(this.$route.params.appointment_id)
      .then((appointment) => {
        let progressChat, confirmedChat, defaultChat;
        progressChat = this.appointmentChats.find((o) => o.status === constants.CHAT_STATUS_PROGRESS);
        confirmedChat = this.appointmentChats.find((o) => o.status === constants.CHAT_STATUS_CONFIRMED);
        defaultChat = this.appointmentChats[0];
        let activeChat = progressChat ? progressChat : confirmedChat ? confirmedChat : defaultChat;
        this.setActiveChat(activeChat);
        this.ready = true
      });
  },
  methods: {
    ...mapActions({
      getAppointment: 'getAppointment',
      clearAppointmentData: 'clearAppointmentData',
      setActiveChat: 'setActiveChat'
    })
  },
  destroyed(){
    this.clearAppointmentData();
  },
  computed: {
    ...mapGetters(['appointmentChats'])
  },
}
</script>
