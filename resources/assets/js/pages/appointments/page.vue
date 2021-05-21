<template>
  <div class="l_appointments_page">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions({
      clearPageAppointments:'clearPageAppointments'
    }),
  },
  computed: {
    ...mapGetters({
      targetUser: 'targetUser',
      appointments: 'appointmentsPageItems',
      pageVariables:'appointmentsPageVariables',
      constants: 'appointmentsPageConstants',
    }),

    filterTypeOptions() {
      return this.constants.type.options;
    },
    filterStatusOptions() {
      return this.constants.status.options;
    }
  },

  destroyed(){
    this.clearPageAppointments();
  },
}
</script>
