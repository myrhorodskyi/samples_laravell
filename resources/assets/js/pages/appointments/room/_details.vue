<template>
  <div class="flex-column chat-wrap">
    <div class="col detail-col flex-column hidden-lg-down">
      <div class="col-md-12 p-0">
        <div class="detail-card">
          <p class="label">Interlocutor:</p>
          <p class="user_name">
            {{interlocutor.full_name}}
          </p>
        </div>
      </div>
      <div class="col-md-12 p-0">
        <div class="detail-card">
          <p class="label">Scheduled for:</p>
          <p class="text" v-for="chat in chatsToShow"
             :class="{'active' : activeChat && chat.id === activeChat.id}">
            {{chat.start_at | humanizeToFormat('MM/DD/YYYY')}}
            <span>from</span>
            {{ chat.start_at | humanizeToActualTimeZone('h:mm A', authUser.tz)}}
            <span>to</span>
            {{ chat.end_at | humanizeToActualTimeZone('h:mm A', authUser.tz)}}
            <span>{{userTimeZone}}</span>
          </p>
        </div>

      </div>

      <div class="col-md-12 p-0">
        <div class="detail-card">
          <p class="label">Duration:</p>
          <p class="sub-title">{{durationOfactiveChat}}</p>
        </div>
      </div>


      <div class="col-md-12 p-0 chat-countdown-col" v-show="isActual && ( isIntervalBefore2 || isChatTime || isCompletedChat )">
        <div class="detail-card">
          <p class="label">{{countdownLabel}}</p>
          <div><countdown :classes="timerMode" :date="countdownTimestamp" @timeLeft="handleTimeExpiration"></countdown></div>
        </div>
      </div>
      <div class="col-md-12 p-0">
        <div class="detail-card">
          <div class="label">Call type:</div>
          <div class="sub-title text-capitalize">{{appointment.type}} Call</div>
        </div>
      </div>


      <div class="col-md-12 p-0">
        <div class="detail-card">
          <appointment-chat-controll />
          <div class="col-md-12 mb-3 p-0" v-if="isActual && isPendingAppointment && !isAppointmentOwner">
            <button type="button" class="btn out-btn-primary w-100 mb-3" @click="confirm">Confirm</button>
            <button type="button" class="btn out-btn-default w-100" @click="reject">Decline</button>
          </div>

          <div class="screen-share-container" :class="isNotBrowserSupport ? 'not-supported' : ''">
            <button
              :disabled="!isPublished || isNotBrowserSupport"
              class="btn out-btn-primary w-100 screen-share-btn"
              @click="toggleShareScreen">
              <span>{{ isScreenShared ? 'Stop Share' : 'Share Screen' }}</span>
            </button>
            <div v-if="isNotBrowserSupport" :class="isNotBrowserSupport ? 'not-supported-text' : '' ">Screen sharing is not supported with browser version</div>
          </div>
        </div>
      </div>

      <div class="col-md-10 p-0">
        <div class="detail-card conference-detail">
          <div class="label">Conference connection details:</div>
          <div class="text">{{appointment.description}}</div>
        </div>
      </div>
    </div>
    <div class="detail-col d-flex chat-row-sm hidden-xl-up">
      <div class="col-md-6 p-0">
        <div class="detail-card">
          <p class="label">Interlocutor:</p>
          <p class="user_name">
            {{interlocutor.full_name}}
          </p>
        </div>
      </div>
      <div class="col-md-6 p-0 chat-countdown-col" v-show="isActual && ( isIntervalBefore2 || isChatTime || isCompletedChat )">
        <div class="detail-card">
          <p class="label">{{countdownLabel}}</p>
          <div><countdown :classes="timerMode" :date="countdownTimestamp" @timeLeft="handleTimeExpiration"></countdown></div>
        </div>
      </div>

      <div class="col-md-6 p-0 hidden-xs-down">
        <div class="detail-card">
          <p class="label">Scheduled for:</p>
          <p class="text" v-for="chat in chatsToShow"
             :class="{'active' : activeChat && chat.id === activeChat.id}">
            {{chat.start_at | humanizeToFormat('MM/DD/YYYY')}}
            <span>from</span>
            {{ chat.start_at | humanizeToActualTimeZone('h:mm A', authUser.tz)}}
            <span>to</span>
            {{ chat.end_at | humanizeToActualTimeZone('h:mm A', authUser.tz)}}
            <span>{{userTimeZone}}</span>
          </p>
        </div>
      </div>

      <div class="col-md-6 p-0 hidden-xs-down">
        <div class="detail-card">
          <p class="label">Duration:</p>
          <p class="sub-title">{{durationOfactiveChat}}</p>
        </div>
      </div>

      <div class="col-md-6 col-sm-8 p-0">
        <div class="detail-card">
          <appointment-chat-controll></appointment-chat-controll>
          <div class="screen-share-container" :class="isNotBrowserSupport ? 'not-supported' : ''">
            <button :disabled="!isPublished || isNotBrowserSupport"
                    class="btn out-btn-primary w-100 screen-share-btn mb-3"
                    @click="toggleShareScreen">
              <span>{{ isScreenShared ? 'Stop Share' : 'Share Screen' }}</span>
            </button>
            <div v-if="isNotBrowserSupport" :class="isNotBrowserSupport ? 'not-supported-text' : '' ">Screen sharing is not supported with browser version</div>
          </div>

          <div class="col-sm-12 p-0" v-if="isActual && isPendingAppointment && !isAppointmentOwner">
            <button type="button" class="btn out-btn-primary w-100 mb-3" @click="confirm">Confirm</button>
            <button type="button" class="btn out-btn-default w-100" @click="reject">Decline</button>
          </div>
        </div>
      </div>
      <div class="col-md-12 p-0 hidden-xs-down">
        <div class="detail-card">
          <div class="label">Conference connection details:</div>
          <div class="text">{{appointment.description}}</div>

        </div>
      </div>
    </div>
  </div>

</template>
<script>
import appointmentWorker from '../../../mixins/appointmentsWorker';
import { mapGetters, mapActions } from 'vuex';
import * as browserDetect from "../../../browserDetect";
import ChatControll from './../room/_chat-controll.vue'
import {getTimeZoneName} from "../../../zone_name"

export default {
  mixins: [appointmentWorker],
  data(){
    return {
      user_timezone: ''
    }
  },

  components : {
    'appointment-chat-controll': ChatControll
  },

  created() {
    this.handleGetAuthUserTimezone();
  },
  computed: {
    ...mapGetters(['activeChat', 'appointmentChats', 'isPublished', 'targetUser', 'authUser']),

    tooEarly(){
      return _.isEmpty(this.appointment.nearest_chat);
    },
    durationOfactiveChat(){
      if(_.isEmpty(this.activeChat)){
        return null;
      }
      let start = moment.parseZone(this.activeChat.start_at),
        end = moment.parseZone(this.activeChat.end_at);

      let m = moment(end, ':m').diff(moment(start, ':m')),
        hours =  moment.utc(m).format('H'),
        minutes =  moment.utc(m).format('m'),
        prefix = hours > 1 ? 'hours ' : 'hour '
      return (hours > 0 ? hours +' '+ prefix : '') + (minutes > 0 ? minutes + ' mins' : '');
    },
    timerMode (){
      return this.isIntervalBefore2 ? 'countdown' : 'timer';
    },
    countdownTimestamp(){
      return this.isChatTime ? this.chatEndTime : this.chatStartTime;
    },
    isActual() {
      return !this.isConfirmedChat || !this.isProgressChat || !this.isCompletedChat;
    },

    chatsToShow() {
      return _.isEmpty(this.chats) ? this.appointmentChats : this.chats;
    },

    isNotBrowserSupport() {
      return browserDetect.screenShareSupport();
    },
    userTimeZone() {
      return getTimeZoneName(this.user_timezone);
    },
    countdownLabel() {
      return this.isIntervalBefore2 ? 'Appointment will start in:' : 'Time Left:'
    }


  },
  methods: {
    ...mapActions(['connectToOpenTokChat', 'getAuthUserTimezone']),
    rescheduleAppointment(){
      console.log('TODO: create reschedule functionality')
    },
    handleTimeExpiration(){
      swal({
        title: 'The chat already started.',
        text: 'Would you like to start?',
        type: 'success',
        showCancelButton: true
      })
        .then(()=>{
          this.connectToOpenTokChat()
        })
    },

    handleGetAuthUserTimezone() {
      return this.getAuthUserTimezone().then(response=>{
        this.user_timezone = response
      })
    }
  },
}
</script>
