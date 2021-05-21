<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col-md-12">
        <span v-html="message"></span>
      </div>
    </div>
  </div>

</template>
<script>
import {mapActions} from  'vuex';

export default {

  metaInfo: { titleTemplate: 'Account has been activated | %s' },

  data: () => ({
    message : 'Activating account...'
  }),

  created() {
    this.handleVerification()
  },

  methods: {
    ...mapActions(['verifyUser']),
    handleVerification () {
      this.verifyUser(this.$route.params.code)
        .then(()=>{
          setTimeout(()=>{
            this.$router.push({name: 'home'});
          }, 1500);
          this.message = '<div class="alert alert-success">Your account has been successfully activated!</div>';
        })
        .catch(()=>{
          this.message = '<div class="alert alert-danger">Confirmation link is invalid</div>';
        });
    }
  }

}
</script>
