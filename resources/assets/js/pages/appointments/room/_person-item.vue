<template>
  <div class="col-md-12 col-sm-12 col-xs-6 col">
    <div class="row justify-content-end">
      <div class="chat-avatar">
        <avatar
          id="nav-avatar"
          :width=68
          :height=68
          :image="person.avatar"
          :color="['247', '250', '253', '1']"
          :border="6"
          :isChange=false
        ></avatar>
      </div>

      <div class="col col-md-8">
        <p class="user_name m-0">{{ person.full_name }}</p>
        <p class="chat_status" :class="{'online': isOnline, 'offline':!isOnline}">{{ isOnline ? 'Online' : 'Offline' }}
          <span class="chat_status_icon" :class="{'online': isOnline, 'offline':!isOnline}"></span>
        </p>
      </div>
    </div>

  </div>
</template>
<script>
import Avatar from '../../../components/Avatar.vue'

export default {
  components: {
    Avatar
  },
  props: {
    person: {
      type: Object,
      required: true
    },
    onlinePersons: {
      type: Array,
      default: () => {
      }
    }
  },
  computed: {
    isOnline () {
      return this.onlinePersons.find((obj) => obj.id === this.person.id)
    }
  }
}
</script>
