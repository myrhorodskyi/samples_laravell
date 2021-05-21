<template>
  <div class="l_password_reset layout">
    <div class="container content">
      <div class="row justify-content-center">
        <div v-if="!sent" class="card">
          <div class="form-header">
            Forgot password?
            <br />
            <p class="form-subheader">Please enter your email address. You will receive a link to create a new password via email.</p>
          </div>
          <div class="card-block">
            <form @submit.prevent="send" @keydown="form.errors.clear($event.target.name)">
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
              <div class="row justify-content-center mb-35">
                <div class="col">
                  <button :disabled="form.busy" type="submit" class="submit-button">
                    Send
                  </button>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col text-center sign-in-trailer">
                  <router-link :to="{name: 'auth.login'}">
                    Return to sign in
                  </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div v-else class="card">
          <img src="../../../../images/success-large.svg" alt="" class="success-img">
          <div class="form-header">
            Check your email
            <br />
            <p class="form-subheader">
              Check your mailbox and follow the instructions
            </p>
          </div>
          <div class="card-block">
            <form @submit.prevent="void(0)">
              <div class="row justify-content-center mb-35">
                <div class="col">
                  <button type="submit" class="submit-button" @click="$router.replace({name: 'home'})">
                    Return to homepage
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
    sent: false,
    form: new Form({ email: '' })
  }),

  methods: {
    send () {
      this.form.post('/api/password/email')
        .then(() => {
          this.form.reset()
          this.sent = true
        })
    }
  }
}
</script>
<style>
.success-img {
  width: 90px;
  height: 90px;
  margin: 50px auto;
}
</style>
