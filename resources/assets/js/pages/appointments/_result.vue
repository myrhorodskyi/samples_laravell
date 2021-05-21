<template>
  <transition name="fade" mode="out-in">
    <div class="list">
      <appointment-item
        :item="appointment"
        :key="appointment.id"
        :index="index"
        v-for="(appointment, index) in appointments"
      >
        <template slot="controls" v-if="appointment.user.person">
          <person-saving-controll :personId="appointment.user.id" :saved="appointment.user.person.is_saved" />
        </template>
      </appointment-item>
    </div>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters({
      appointments: 'appointmentsPageItems',
    })
  }
}
</script>
