import * as constants from '../constants';
import { mapGetters } from 'vuex';

export default {
  data(){
    return {
      nowUtcUnix: moment.tz('UTC').unix(),
      intervalBefore1: constants.CHAT_CUTOFF_PERIOD_MINUTES,
      intervalBefore1unix: constants.CHAT_CUTOFF_PERIOD_MINUTES * 60 * 1000
    }
  },
  created(){
    setInterval(() => {
      this.nowUtcUnix = moment.tz('UTC').unix();
    }, 1000)
  },
  computed: {
    ...mapGetters(['appointmentChats']),
    temp(){
      return [
        moment.tz('UTC').unix(),
        moment.parseZone(this.activeChat.start_at).unix()
      ]
    },
    isChatSelected (){
      return !_.isEmpty(this.activeChat);
    },
    chatStartTime(){
      if(!this.isChatSelected) return null;
      return moment.parseZone(this.activeChat.start_at).unix();
    },
    chatEndTime(){
      if(!this.isChatSelected) return null;
      return moment.parseZone(this.activeChat.end_at).unix();
    },
    isEarly(){
      if(this.chatStartTime < this.nowUtcUnix) return false;
      let difference = this.getDifference(this.chatStartTime, this.nowUtcUnix);
      return difference > this.minutesInMilliseconds(10);
    },
    isIntervalBefore2(){
      if(this.chatStartTime < this.nowUtcUnix) return false;
      let difference = this.getDifference(this.chatStartTime, this.nowUtcUnix);
      return  difference < this.minutesInMilliseconds(10);
    },

    isIntervalBefore1(){
      if(this.chatStartTime < this.nowUtcUnix) return false;
      let difference = this.getDifference(this.chatStartTime, this.nowUtcUnix);
      return  difference < this.minutesInMilliseconds(this.intervalBefore1);
    },
    isChatTime(){
      return this.chatStartTime < this.nowUtcUnix && this.nowUtcUnix < this.chatEndTime;
    },
    inExtraTime(){
      return (this.chatStartTime - this.intervalBefore1unix) < this.nowUtcUnix
        && this.nowUtcUnix < (this.chatEndTime + this.intervalBefore1unix);
    },
    isCompletedChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_COMPLETED;
    },
    isProgressChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_PROGRESS;
    },
    isPendingChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_PENDING;
    },
    isDraftChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_DRAFT;
    },
    isConfirmedChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_CONFIRMED;
    },
    isRejectedChat (){
      if(!this.isChatSelected) return false;
      return this.activeChat.status === constants.CHAT_STATUS_REJECTED;
    },
    placeholder() {
      return  this.isEarly ? 'The video line will open ' + this.intervalBefore1 + ' minutes before the scheduled appointment start time.' : 'Type your message here...'
    }
  },
  methods: {
    getDifference(valStart, valEnd){
      let diff = valEnd - valStart;
      return diff > 0 ? diff : diff * -1;
    },
    minutesInMilliseconds(val){
      return val * 60;
    }
  }
};
