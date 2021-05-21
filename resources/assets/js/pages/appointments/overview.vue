<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="page_header">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              Appointments
            </div>
          </div>
        </div>
      </div>
      <appointments-tab-menu
        :tabs="filterStatusOptions"
        :types="filterTypeOptions"
        :appointments="appointments"
        @typeChanged="filterAppointments"
      />
      <div class="layout">
        <div class="container">
          <preload v-if="this.showPreload &&  this.variables.page == '1'"></preload>
          <div class="row m-0 col-md-12" v-else>
            <div class="sub-title" v-if="!appointments.length">{{emptyMessage}}</div>
            <div class="col-lg-4 col-md-6 p-0" v-for="(appointment, index) in appointments">
              <appointment-item
                class="appoinment_item"
                :item="appointment"
                :key="appointment.id"
                @cancel="handleCancelAppointment"
                @reject="handleRejectAppointment"
                @confirm="handleConfirmAppointment"
                :index="index"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pre-footer" v-if="!this.showPreload">
        <div class="text-center">
          <button
            type="button"
            class="btn out-btn-primary"
            v-if="showLoadMoreButton"
            @click="loadMoreAppointments"
          >
            Load More Appointments
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import pageVariables from '../../mixins/pageVariables';
export default {
  name: 'appointments',
  mixins:[pageVariables],
  data:() =>({
    loading:false,
  }),

  created(){
    this.clearPageAppointments();
  },
  methods: {
    ...mapActions({
      setPageVariables: 'updateAppointmentsPageVariables',
      fetchPageAppointments: 'fetchPageAppointments',
      clearPageAppointments:'clearPageAppointments',
    }),
    handlePageVariablesUpdate(changes){
      this.loading = true;
      this.fetchPageAppointments(changes).then((res)=>{
        if(res) {
          this.loading = false;
        }
      });
    },

    filterAppointments(type) {
      this.variables.type = type;
      this.variables.page = this.constants.page.defaultValue;
      this.clearPageAppointments();
      this.updatePageVariables();
    },
    updateVariablesFromUrl() {
      let param, value;
      let type = _.replace(this.$route.name, 'appointments.', ''),
        neededStatus = this.constants.status.options.find(obj => _.toLower(obj.label) === _.toLower(type));
      this.variables.status =  neededStatus ? neededStatus.value : this.constants.status.defaultValue;
      for (param in this.$route.query) {
        value = this.$route.query[param];

        if (this.variables[param] !== undefined && value) {
          this.variables[param] = value;
        }
      }
      this.updatePageVariables();
    },
    loadMoreAppointments() {
      this.variables.page++;
      this.updatePageVariables();
    },
    setDefaultPageVariables(){
      _.each(this.constants, (value, key) => {
        this.variables[key] = value.defaultValue;
      });
    },
    handleCancelAppointment(index) {
      this.appointments.splice(index, 1);
    },
    handleRejectAppointment(index) {
      this.appointments.splice(index, 1);
    },

    handleConfirmAppointment(index) {
      this.appointments.splice(index, 1);
    },
  },
  watch: {
    '$route.params.status': function(val){
      this.variables.page = this.constants.page.defaultValue;
      this.clearPageAppointments();
      this.updateVariablesFromUrl();
    }
  },
  computed: {
    ...mapGetters({
      targetUser: 'targetUser',
      appointments: 'appointmentsPageItems',
      pageVariables:'appointmentsPageVariables',
      constants: 'appointmentsPageConstants',
      count_past: 'count_past',
      count_pending: 'count_pending',
      count_upcoming:'count_upcoming'
    }),

    filterTypeOptions() {
      return this.constants.type.options;
    },
    filterStatusOptions() {
      return this.constants.status.options;
    },
    isRoom(){
      return this.$route.name === 'appointments.room';
    },
    emptyMessage(){
      return 'You have no ' + _.replace(this.$route.name, 'appointments.', '') + ' appointments.'
    },
    showPreload() {
      return this.loading;
    },
    showLoadMoreButton() {
      let page = this.$route.name;
      switch (page) {
        case 'appointments.upcoming':
          return this.appointments.length < this.count_upcoming;
        case 'appointments.pending':
          return this.appointments.length < this.count_pending;
        case 'appointments.past':
          return this.appointments.length < this.count_past;
      }
    }
  },
  destroyed(){
    this.clearPageAppointments();
  },
}
</script>
