<template>
  <div>
    <primary-header />
    <div class="container">
      <child/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    user: 'authUser',
    authenticated: 'authCheck'
  })
}
</script>
