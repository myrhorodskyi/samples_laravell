<template>
  <div class="card">
    <div class="card-header">
      Your Info
    </div>
    <div class="card-block">
      <form @submit.prevent="update" @keydown="form.errors.clear($event.target.name)">
        <alert-success :form="form" message="Your profile has been updated!"></alert-success>

        <!-- First Name -->
        <div class="form-group row" :class="{ 'has-danger': form.errors.has('first_name') }">
          <label for="first_name" class="col-sm-3 col-form-label text-sm-right">First Name</label>
          <div class="col-sm-7">
            <input v-model="form.first_name" type="text" name="name" id="first_name" class="form-control">
            <has-error :form="form" field="first_name"></has-error>
          </div>
        </div>

        <!-- Last Name -->
        <div class="form-group row" :class="{ 'has-danger': form.errors.has('last_name') }">
          <label for="last_name" class="col-sm-3 col-form-label text-sm-right">Last Name</label>
          <div class="col-sm-7">
            <input v-model="form.last_name" type="text" name="name" id="last_name" class="form-control">
            <has-error :form="form" field="last_name"></has-error>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group row" :class="{ 'has-danger': form.errors.has('email') }">
          <label class="col-sm-3 col-lg-3 col-form-label text-right">Email</label>
          <div class="col-sm-9 col-lg-6">
            <input v-model="form.email" type="text" name="email" class="form-control">
            <has-error :form="form" field="email"></has-error>
          </div>
        </div>

        <!-- avatar -->
        <div class="form-group row">
          <label for="avatar" class="col-sm-3 col-form-label text-sm-right">Profile picture</label>
          <div class="col-sm-7">
            <avatar
              :width=400
              :height=400
              ref="vueavatar"
              @avatar-editor:image-ready="onImageReady"
              :image="form.avatar"
            >
            </avatar>
            <br>
            <avatar-scale
              ref="vueavatarscale"
              @avatar-editor-scale:change-scale="onChangeScale"
              :width=250
              :min=1
              :max=3
              :step=0.02
            >
            </avatar-scale>
          </div>
        </div>

        <!-- Birthday -->
        <div class="form-group row" :class="{ 'has-danger': form.errors.has('birthday') }">
          <label class="col-sm-3 col-lg-3 col-form-label text-right">Birthday</label>
          <div class="col-sm-9 col-lg-6">
            <date-select :default="form.birthday" @date-change="setBirthday"></date-select>
            <has-error :form="form" field="birthday"></has-error>
          </div>
        </div>


        <!-- Update Button -->
        <div class="form-group row">
          <div class="col-sm-9 offset-sm-3 col-lg-6 offset-lg-3">
            <button :disabled="form.busy" type="submit" class="btn btn-success">
              <icon v-if="form.busy" name="spinner"></icon>
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Form from 'vform'
import {mapGetters} from 'vuex'
import Avatar from "../../components/Avatar.vue"
import AvatarScale from "../../components/AvatarScale.vue"
import DateSelect from "../../components/DateSelect.vue"

export default {
  components: {
    Avatar,
    AvatarScale,
    DateSelect
  },
  data: () => ({
    form: new Form({
      first_name: '',
      last_name: '',
      email: '',
      birthday: new Date(1990, 1, 1),
      avatar: null
    }),
    dateformat: 'YYYY-MM-DD',
  }),

  computed: mapGetters({
    user: 'authUser'
  }),

  created() {
    ['first_name', 'last_name', 'email', 'birthday', 'avatar'].forEach(key => {
      this.form[key] = this.user[key]
    })
  },

  methods: {
    update() {
      this.form.birthday = moment(this.form.birthday).format(this.dateformat);

      this.form.avatar = this.$refs.vueavatar.getImageScaled().toDataURL();

      this.form.patch('/api/user')
        .then(({data}) => {
          this.$store.dispatch('updateUser', {user: data})
        })
    },
    onChangeScale(scale) {
      this.$refs.vueavatar.changeScale(scale)
    },
    onImageReady(scale) {
      this.$refs.vueavatarscale.setScale(scale)
    },
    setBirthday: function(date) {
      this.form.birthday = date.format(this.dateformat);
    }
  }
}
</script>
