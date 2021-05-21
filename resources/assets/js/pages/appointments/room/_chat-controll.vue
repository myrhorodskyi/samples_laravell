<template>
  <div class="row m-0 mb-3">
    <div class="col-md-12 row m-0 p-0" v-if="shouldShowStartStopBtn">
      <button
        v-text="startButtonName"
        @click="toggleChatConnection"
        :disabled="!isIntervalBefore1 && !isProgressChat"
        type="button"
        class="btn out-btn-primary w-100 text-center"
      />
    </div>
  </div>
</template>
<script>
import appointmentWorker from '../../../mixins/appointmentsWorker'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  mixins: [appointmentWorker],
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['isPublished']),
    archives () {
      const activeChatId = this.activeChat.id
      const activeChat = _.find(this.appointment.chats, { 'id': activeChatId })
      const activeChatArchive = activeChat.archives
      return _.isEmpty(activeChatArchive) ? [] : activeChatArchive
    },
    archive () {
      return this.archives[this.archives.length - 1]
    },
    startButtonName () {
      if (this.isPublished) {
        if (this.appointment.type === 'video') {
          return 'Stop Video'
        } else {
          return 'Stop Audio'
        }
      } else {
        if (this.appointment.type === 'video') {
          return 'Start Video'
        } else {
          return 'Start Audio'
        }
      }
    },
    shouldShowStartStopBtn () {
      return this.isProgressChat || this.isIntervalBefore2 || this.isIntervalBefore1
    }
  },
  methods: {
    ...mapActions(['toggleChatConnection']),
    buttonName (archive) {
      return archive.status !== 'uploaded' ? 'Uploading' : 'Download'
    }
  }
}
</script>
