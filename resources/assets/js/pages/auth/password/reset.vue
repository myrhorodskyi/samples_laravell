<template>
  <div class="l_password_reset layout">
    <div class="container content">
      <div class="row justify-content-center">
        <div class="card">
          <div class="form-header">
            Reset Password
          </div>

          <div class="card-block">
            <form @submit.prevent="reset" @keydown="form.errors.clear($event.target.name)">
              <div v-if="status" class="alert alert-success">
                {{ status }}
              </div>

              <div class="row mb-35">
                <div class="col-md-12">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    v-model="form.email"
                    name="email"
                    class="form-control"
                    id="email"
                    :class="{ 'is-invalid': form.errors.has('email') }"
                  >
                  <has-error
                    :form="form"
                    field="email"
                    class="invalid-feedback"
                  />
                </div>
              </div>

              <div class="row mb-35">
                <div class="col-md-12" :class="{ 'md-input-invalid': form.errors.has('password') }">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" v-model="form.password" name="password" class="form-control" id="password">
                  <has-error :form="form" field="password" class="md-error"></has-error>
                </div>
              </div>

              <div class="row mb-35">
                <div class="col-md-12" :class="{ 'md-input-invalid': form.errors.has('password_confirmation') }">
                  <label for="password" class="form-label">Password Confirmation</label>
                  <input
                    type="password" v-model="form.password_confirmation" name="password_confirmation" class="form-control" id="password_confirmation">
                  <has-error :form="form" field="password_confirmation" class="md-error"></has-error>
                </div>
              </div>

              <div class="row justify-content-center mb-35">
                <div class="col">
                  <button :disabled="form.busy" type="submit" class="submit-button">
                    <icon v-if="form.busy" name="spinner"></icon>
                    Reset Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from 'vform'

export default {
  metaInfo: { titleTemplate: 'Reset Password | %s' },

  data: () => ({
    status: null,
    form: new Form({
      token: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
  }),

  methods: {
    reset () {
      this.form.token = this.$route.params.token

      this.form.post('/api/password/reset')
        .then(({ data: { status }}) => {
          this.form.reset()
          this.status = status
          this.$router.replace({name: 'auth.login', params: {reset_password:this.status}});
        })
    }
  }
}
</script>
