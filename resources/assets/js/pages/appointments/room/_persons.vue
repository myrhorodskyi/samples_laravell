<template>
  <div class="row m-0">
    <person-item
      :person="person"
      :onlinePersons="onlineUsers"
      v-for="person in persons"
    />
  </div>
</template>
<script>
import appointmentWorker from '../../../mixins/appointmentsWorker'
import PersonItem from './_person-item.vue';
import {mapGetters} from 'vuex';

export default {
  mixins: [appointmentWorker],
  components: {
    'person-item': PersonItem
  },
  computed: {
    ...mapGetters(['onlineUsers'])
  }
}
</script>
