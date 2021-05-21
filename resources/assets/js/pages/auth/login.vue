<template>
  <div class="l_login layout">
    <div class="container content">
      <div class="row justify-content-center">

        <div class="row mt-3 mb-3" v-if="this.$route.params.completed">
          <div class="col-md-12">
            <div class="alert alert-success">
              Your account has been successfully created.
              Please, check your email and follow the activation link to activate account.
            </div>
          </div>
        </div>

        <div class="row" v-if="this.$route.params.reset_password">
          <div class="col-md-12">
            <div class="alert alert-success">
              Your password has been reset!
            </div>
          </div>
        </div>
        <div class="clearfix w-100"></div>

        <div class="card">
          <span class="text-center form-header">Sign In</span>
          <div class="card-block">
            <form @submit.prevent="send" @keydown="form.errors.clear($event.target.name)">
              <div class="row mb-35 mt-25">
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
                  <div class="row">
                    <div class="col">
                      <label for="password" class="form-label">Password</label>
                    </div>
                    <div class="col text-right">
                      <router-link :to="{ name: 'password.request' }" class="forgot-link">
                        Forgot Password?
                      </router-link>
                    </div>
                  </div>
                  <input type="password" v-model="form.password" name="password" class="form-control" id="password">
                  <has-error :form="form" field="password" class="md-error"></has-error>
                </div>
              </div>

              <div class="row justify-content-start mb-35">
                <div class="col-md-6">
                  <input class="form-check-input" type="checkbox" value="1" id="remember_me" v-model="form.remember">
                  <label class="form-check-label" for="remember_me">
                    Remember me
                  </label>
                </div>

              </div>

              <div class="row justify-content-center mb-35">
                <div class="col">
                  <button :disabled="form.busy" type="submit" class="btn submit-button">
                    <icon v-if="form.busy" name="spinner"></icon>
                    Sign In
                  </button>
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col align-items-center text-center join-trailer">
                  <span>
                    Don't have an account?
                    <router-link :to="{ name: 'auth.join' }">
                      Join now
                    </router-link>
                  </span>
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
import {mapActions} from 'vuex';

export default {
  name: 'login',

  metaInfo() {
    return {
      title: 'Login',
    }
  },

  data: () => ({
    form: new Form({
      email: '',
      password: '',
      remember: false
    })
  }),

  created() {
    if (this.$route.params.email) {
      this.form.email = this.$route.params.email;
    }
  },

  methods: {
    ...mapActions(['login']),
    send() {
      this.login(this.form)
        .then(() => {
          let profile_url = _self.$cookie.get('share_profile');
          if (profile_url) {
            setTimeout(() => {
              this.$router.push({path: '/public/person/' + profile_url});
              this.$cookie.delete('share_profile');
            }, 50)
          } else {
            this.$router.push({path: '/profile/person'})
          }
        })
        .catch(err => console.log(err))
    },
  }
}
</script>
