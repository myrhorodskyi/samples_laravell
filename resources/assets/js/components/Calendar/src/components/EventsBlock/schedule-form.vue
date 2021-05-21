<template>
  <div class="col align-self-center p-0" v-if="canSchedule || true">
    <div class="col-md-12 p-0 cal-events__priority">
      <button id="show-modal" class="btn out-btn out-btn-warning btn-add-event w-100 mt-3" @click="openModal">
        <icon name="plus"></icon>
        Add Availability
      </button>
    </div>
    <modal class="shedule-form-modal" v-if="showModal" @close="openModal">
      <div slot="header" class="appointment_availability_header">
        Appointment Availability
        <button @click="closeModal" type="button" class="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div slot="body">
        <div class="row m-0">
          <h2>Availability</h2>
        </div>

        <div class="row box mb-4 mr-0 ml-0" v-for="(period, index) in schedule.periods">
          <md-input-container class="custom-input time-picker-start col-md-4 time-picker-container">
            <label>Start</label>
            <vue-timepicker
              v-model="period.start_time"
              format="hh:mm A"
              :minute-interval="minuteInterval"
              :class="{ 'has-danger': schedule.errors.has('periods.' + index + '.start_time') }"
              hide-clear-button
            />
          </md-input-container>

          <md-input-container class="custom-input time-picker-end time-picker-container col-md-4 ">
            <label>End</label>
            <vue-timepicker
              v-model="period.end_time"
              format="hh:mm A"
              :minute-interval="minuteInterval"
              :class="{ 'has-danger': schedule.errors.has('periods.' + index + '.end_time') }"
              hide-clear-button
            />
          </md-input-container>

          <button v-if="schedule.periods.length > 1" class="btn out-btn-secondary remove-period"
                  @click="removePeriod(index)">
            <icon name="trash"></icon>
          </button>
          <has-error :form="schedule" :field="'periods.'+index+'.start_time'" class="text-danger"></has-error>
        </div>

        <button class="btn out-btn out-btn-secondary out-btn-info mt-3" @click.prevent="addPeriod">Add Availability
        </button>

        <div class="row m-0">
          <h2>Recurrence pattern</h2>
        </div>
        <div class="w-100 box">
          <div class="row"
               :class="{ 'has-danger': schedule.errors.has('repeat.count') || schedule.errors.has('repeat.type')}">
            <div class="col-md-12 p-0">
              <md-radio v-model="schedule.repeat.type"
                        name="repeat_type"
                        :md-value="option.value"
                        v-for="option in repeatOptions"
                        class="md-primary col p-0 mr-5">{{ option.label }}
              </md-radio>
            </div>
            <div class="col-md-12">
              <has-error :form="schedule" :field="'repeat.count'" class="text-danger"></has-error>
              <has-error :form="schedule" :field="'repeat.type'" class="text-danger"></has-error>
            </div>
          </div>
          <div class="row recurrence-pattern" v-if="shouldRepeat">
            <div class="col-md-8">
              <div class="row align-items-end">
                <div class="d-inline-block">
                  <label class="label">Recur every</label>
                </div>
                <div class="d-inline-block col-md-2">
                  <md-input-container class="custom-input repeat-schedule">
                    <md-input class="text-center" v-model="schedule.repeat.count"
                              @change="validateRepeatCount"
                              type="number"
                              :min="1">
                    </md-input>
                  </md-input-container>
                </div>
                <div class="d-inline-block">
                  <label class="label">{{ schedule.repeat.type }}(s):</label>
                </div>

              </div>
            </div>

            <div v-if="!dailyRepeat" class="form-group"
                 :class="{ 'has-danger': schedule.errors.has('repeat.weekdays') }">
              <div class="row">
                <div v-for="(dayOption, index) in daysOptions" class="custom-check  col-md-3">
                  <input v-if="!dailyRepeat" :id="'dayOption'+index" v-model="schedule.repeat.weekdays"
                         :value="dayOption"
                         type="checkbox"/>

                  <label class="recurrence-label" :for="'dayOption'+index">{{ dayOption }}</label>
                </div>
                <has-error :form="schedule" field="offers"
                           v-model="schedule.repeat.weekdays"></has-error>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="d-block m-0-auto">
        <button :disabled="schedule.busy || dayliEventsSaveProgress === 'progress'" class="btn out-btn out-btn-primary"
                @click="saveSchedule">
          <icon v-if="schedule.busy  || dayliEventsSaveProgress === 'progress'" name="spinner"></icon>
          Save
          <md-ink-ripple/>
        </button>
        <button class="btn out-btn out-btn-default" @click="closeModal">Cancel</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Multiselect from 'vue-multiselect'
import Form from 'vform'
import { SLOT_INTERVAL_IN_MINUTES } from '../../../../../constants'
import _ from 'lodash'
import moment from 'moment'
import swal from 'sweetalert'

export default {
  name: 'booking-schedule-form',
  components: {
    Multiselect
  },
  data () {
    return {
      showModal: false,
      schedule: new Form({
        periods: [{
          start_time: {
            hh: '',
            mm: '',
            A: 'AM'
          },
          end_time: {
            hh: '',
            mm: '',
            A: 'PM'
          }
        }],
        repeat: {
          type: 'null',
          weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          count: 1
        }
      }),
      repeatOptions: [
        {
          label: 'Never repeat',
          value: 'null'
        },
        {
          label: 'Daily',
          value: 'day'
        },
        {
          label: 'Weekly',
          value: 'week'
        }
      ],
      daysOptions: moment.weekdays(),
      dayliEventsSaveProgress: ''
    }
  },
  created () {
    if (_.isEmpty(this.schedule.periods)) {
      this.addPeriod()
    }
  },
  props: {
    selectedDay: {
      type: String,
      default: () => moment().format('YYYY:MM:DD')
    },

    eventLength: {
      type: Number
    }
  },
  computed: {
    ...mapGetters(['authUser']),
    shouldRepeat () {
      return this.schedule.repeat.type !== 'null'
    },
    dailyRepeat () {
      return this.schedule.repeat.type === 'day'
    },
    minuteInterval () {
      return Math.round(SLOT_INTERVAL_IN_MINUTES % 60)
    },
    maxRepeatValue () {
      if (this.schedule.repeat.type === 'month') return 6
      if (this.schedule.repeat.type === 'week') return 26
      if (this.schedule.repeat.type === 'day') return 182
    },
    canSchedule () {
      const now = moment()
      const selectedMoment = moment(this.selectedDay, 'YYYY/MM/DD')
          .set({
            hour: now.hour(),
            minute: now.minute(),
            second: now.second(),
            millisecond: now.millisecond()
          })
      return selectedMoment >= now.add(24, 'hours') && selectedMoment <= now.add(6, 'months')
    }
  },

  watch: {
    dailyRepeat: function (val) {
      let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      if (val) {
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
      this.schedule.repeat.weekdays = days
    }
  },

  methods: {
    ...mapActions(['validateAdvisorSchedule', 'setAdvisorSchedule']),
    async saveSchedule () {
      this.dayliEventsSaveProgress = 'progress'
      const params = {
        data: {
          ...this.schedule.data(),
          day: this.selectedDay
        },
        userId: this.authUser.id
      }

      try {
        await this.validateAdvisorSchedule(params)
        try {
          await this.setAdvisorSchedule(params)
          setTimeout(() => {
            this.dayliEventsSaveProgress = 'finish'
            this.closeModal()
            this.$emit('schedule')
            return swal({
              type: 'success',
              title: 'Schedule successfully created'
            })
          }, 1000)
        } catch (e) {
          this.closeModal()
          return swal({
            type: 'error',
            title: 'Oops! Something went wrong. Please contact our support'
          })
        }
      } catch (e) {
        this.schedule.errors.set(e.response.data)
        this.dayliEventsSaveProgress = 'finish'
        swal({
          type: 'error',
          title: 'Oops...Something went wrong! Please try again.',
          icon: 'error'
        })
      }
    },
    closeModal () {
      this.showModal = false
      document.body.classList.remove('open-modal')
      this.dayliEventsSaveProgress = 'finish'
    },
    openModal () {
      this.showModal = true
      this.timePikerStylesChange()
      this.schedule.reset();
      document.body.classList.add('open-modal')
    },
    addPeriod () {
      const prevPeriod = this.schedule.periods[this.schedule.periods.length - 1]
      this.schedule.periods.push({
        start_time: {
          hh: (+prevPeriod.end_time.hh) || '',
          mm: (+prevPeriod.end_time.mm) || '',
          A: 'AM'
        },
        end_time: {
          hh: +prevPeriod.end_time.hh ? (+prevPeriod.end_time.hh + 1) || '' : '',
          mm: (+prevPeriod.end_time.mm) || '',
          A: 'PM'
        }
      })
      this.timePikerStylesChange()
    },
    removePeriod (index) {
      this.schedule.periods.splice(index, 1)
    },
    validateRepeatCount () {
      if (this.schedule.repeat.count !== null && (this.schedule.repeat.count < 1 || this.schedule.repeat.count > this.maxRepeatValue)) {
        this.schedule.repeat.count = null
      }
    },
    timePikerStylesChange () {
      setTimeout(() => {
        this.updatePickerLabels()
      }, 500)
    },
    updatePickerLabels () {
      [
        ...document.querySelectorAll('.time-picker-start .apms .hint'),
        ...document.querySelectorAll('.time-picker-end .apms .hint')
      ].forEach(el => {
        el.textContent = 'AM/PM'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.appointment_availability_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  line-height: 1.5;
  letter-spacing: normal;

  button.close {
    align-self: start;
    margin: 15px -25px 15px 15px;
  }
}

@media (max-width: 991.98px) {
  .appointment_availability_header {
    font-size: 30px;
  }
}

@media (max-width: 767.98px) {
  .appointment_availability_header {
    font-size: 25px;
  }
}
</style>
